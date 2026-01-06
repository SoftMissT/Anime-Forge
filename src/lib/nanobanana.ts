// lib/nanobanana.ts
import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("A chave de API do Google Gemini não foi configurada.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image';

export interface ImageResult {
    imageUrl: string; // data:image/png;base64,...
    mimeType: string;
}

export async function generateImageFromPrompt(prompt: string): Promise<ImageResult> {
    try {
        const result = await ai.models.generateContent({
            model: model,
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePart = result.candidates?.[0]?.content?.parts?.find(
            (part: any) => part.inlineData && part.inlineData.mimeType.startsWith('image/')
        );

        if (imagePart && imagePart.inlineData) {
            const base64ImageBytes: string = imagePart.inlineData.data as string;
            const mimeType: string = imagePart.inlineData.mimeType as string;
            const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
            return { imageUrl, mimeType };
        } else {
            console.error("Nano Banana response did not contain a valid image part:", result);
            throw new Error("A IA não retornou uma imagem válida.");
        }
    } catch (error: any) {
        console.error("Erro na geração de imagem com Nano Banana:", error);
        throw new Error(error.message || 'Ocorreu um erro desconhecido ao gerar a imagem.');
    }
}

interface EditImagePayload {
    prompt: string;
    base64ImageData: string;
    mimeType: string;
}

export async function editImage({ prompt, base64ImageData, mimeType }: EditImagePayload): Promise<ImageResult> {
    try {
        const result = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    { inlineData: { data: base64ImageData, mimeType: mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePart = result.candidates?.[0]?.content?.parts?.find(
            (part: any) => part.inlineData && part.inlineData.mimeType.startsWith('image/')
        );
        
        if (imagePart && imagePart.inlineData) {
            const base64ImageBytes: string = imagePart.inlineData.data as string;
            const newMimeType: string = imagePart.inlineData.mimeType as string;
            const imageUrl = `data:${newMimeType};base64,${base64ImageBytes}`;
            return { imageUrl, mimeType: newMimeType };
        } else {
            console.error("Nano Banana edit response did not contain a valid image part:", result);
            throw new Error("A IA não retornou uma imagem editada válida.");
        }
    } catch (error: any) {
        console.error("Erro na edição de imagem com Nano Banana:", error);
        throw new Error(error.message || 'Ocorreu um erro desconhecido ao editar a imagem.');
    }
}
