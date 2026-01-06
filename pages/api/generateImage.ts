// pages/api/generateImage.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI, Modality } from '@google/genai';
import { supabase, supabaseInitializationError } from '../../lib/supabaseClient';
import { getTursoClient } from '../../lib/server/turso';
import { getCloudinaryUploader, cloudinaryInitializationError } from '../../lib/server/cloudinary';
import { imagekit, imagekitInitializationError } from '../../lib/server/imagekit';
import type { User, GenerateImageRequest, Category, GeneratedItem } from '../../types';

const getUserGeminiKey = async (userId: string): Promise<string | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('user_api_keys').select('gemini_api_key').eq('user_id', userId).single();
    if (error && error.code !== 'PGRST116') {
        console.error('Supabase error fetching gemini key:', error);
        return null;
    }
    return data?.gemini_api_key;
};

// Categorias que serão salvas no ImageKit
const IMAGEKIT_CATEGORIES: Category[] = ['Arma', 'Acessório', 'Inimigo/Oni', 'Local/Cenário'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ image?: string, updatedItem?: GeneratedItem } | { message: string; details?: string }>
) {
    if (supabaseInitializationError) {
      return res.status(503).json({ message: `Serviço de Autenticação indisponível: ${supabaseInitializationError}` });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    let db;
    try {
        db = await getTursoClient();
    } catch (e: any) {
        return res.status(503).json({ message: e.message, details: e.message });
    }

    try {
        const { prompt, user, creationId, category, sourceImage } = req.body as GenerateImageRequest;
        const isForjaMode = creationId && category;

        if (!user || !user.id) return res.status(401).json({ message: 'Autenticação de usuário é necessária.' });
        if (!prompt) return res.status(400).json({ message: 'O prompt é obrigatório.' });

        const userApiKey = await getUserGeminiKey(user.id);
        const apiKey = userApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'Nenhuma chave de API do Gemini foi configurada no servidor.' });
        }

        const ai = new GoogleGenAI({ apiKey });

        const parts: any[] = [];
        if (sourceImage) {
            parts.push({
                inlineData: {
                    mimeType: sourceImage.mimeType,
                    data: sourceImage.data
                }
            });
        }
        parts.push({ text: prompt });

        // Etapa 1: Gerar a imagem com Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: { responseModalities: [Modality.IMAGE] },
        });

        const firstPart = response.candidates?.[0]?.content?.parts?.[0];
        if (!firstPart || !('inlineData' in firstPart) || !firstPart.inlineData?.data) {
             const safetyRatings = response.candidates?.[0]?.safetyRatings;
            if (safetyRatings?.some(r => r.blocked)) throw new Error('A geração da imagem foi bloqueada por motivos de segurança.');
            throw new Error('A resposta da IA não continha uma imagem válida.');
        }

        const generatedImageB64 = firstPart.inlineData.data;

        // Modo Cosmaker: apenas retorna a imagem
        if (!isForjaMode) {
            return res.status(200).json({ image: generatedImageB64 });
        }

        // Modo Forja: faz upload e atualiza o DB
        const uploaderType = IMAGEKIT_CATEGORIES.includes(category) ? 'imagekit' : 'cloudinary';
        let uploadResult;
        let imageUrl: string | undefined;
        let imagePublicId: string | undefined;

        // Etapa 2: Fazer upload para o CDN correto
        if (uploaderType === 'imagekit') {
            if (imagekitInitializationError) throw new Error(imagekitInitializationError);
            if (!imagekit) throw new Error('Cliente ImageKit não foi inicializado.');
            uploadResult = await imagekit.upload({
                file: generatedImageB64,
                fileName: `${creationId}.jpg`,
                folder: `/kimetsu-forge/${category}`,
            });
            imageUrl = uploadResult.url;
            imagePublicId = uploadResult.fileId;
        } else { // Cloudinary
            if (cloudinaryInitializationError) throw new Error(cloudinaryInitializationError);
            const uploader = getCloudinaryUploader();
            uploadResult = await uploader.upload(`data:image/jpeg;base64,${generatedImageB64}`, {
                public_id: creationId,
                folder: `kimetsu-forge/${category}`,
                overwrite: true,
            });
            imageUrl = uploadResult.secure_url;
            imagePublicId = uploadResult.public_id;
        }

        // Etapa 3: Atualizar o item no banco de dados (Turso)
        const { rows } = await db.execute({
            sql: 'SELECT content FROM creations WHERE id = ? AND userId = ?',
            args: [creationId, user.id]
        });

        if (rows.length === 0) throw new Error('Criação não encontrada ou acesso negado.');
        
        const currentContent = JSON.parse(rows[0].content as string);
        const updatedContent = { ...currentContent, imageUrl, imagePublicId, imageProvider: uploaderType };

        await db.execute({
            sql: 'UPDATE creations SET content = ? WHERE id = ?',
            args: [JSON.stringify(updatedContent), creationId]
        });

        const updatedItem: GeneratedItem = {
            id: creationId,
            userId: user.id,
            ...updatedContent
        };
        
        res.status(200).json({ updatedItem });

    } catch (error: any) {
        console.error("Error in /api/generateImage:", error);
        res.status(500).json({ message: error.message || 'Falha ao processar a imagem.' });
    }
}