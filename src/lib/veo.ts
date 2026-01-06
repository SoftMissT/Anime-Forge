// lib/veo.ts
import { GoogleGenAI, GenerateVideosOperation } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("A chave de API do Google Gemini não foi configurada.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'veo-3.1-fast-generate-preview';

interface StartVideoPayload {
    prompt: string;
    resolution: '720p' | '1080p';
    aspectRatio: '16:9' | '9:16';
    base64ImageData?: string;
    mimeType?: string;
}

export async function startVideoGeneration({ prompt, resolution, aspectRatio, base64ImageData, mimeType }: StartVideoPayload): Promise<GenerateVideosOperation> {
    try {
        const imagePayload = (base64ImageData && mimeType) 
            ? { image: { imageBytes: base64ImageData, mimeType } } 
            : {};
            
        const operation = await ai.models.generateVideos({
            model: model,
            prompt,
            ...imagePayload,
            config: {
                numberOfVideos: 1,
                resolution: resolution,
                aspectRatio: aspectRatio,
            }
        });
        return operation;
    } catch (error: any) {
        console.error("Erro ao iniciar a geração de vídeo com Veo:", error);
        throw new Error(error.message || 'Ocorreu um erro desconhecido ao iniciar a geração de vídeo.');
    }
}

interface CheckStatusPayload {
    operation: GenerateVideosOperation;
}

export async function checkVideoGenerationStatus({ operation }: CheckStatusPayload): Promise<GenerateVideosOperation> {
     try {
        const updatedOperation = await ai.operations.getVideosOperation({ operation: operation });
        return updatedOperation;
    } catch (error: any) {
        console.error("Erro ao verificar o status da geração de vídeo:", error);
        throw new Error(error.message || 'Ocorreu um erro desconhecido ao verificar o status do vídeo.');
    }
}
