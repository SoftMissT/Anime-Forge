

import { GoogleGenAI } from "@google/genai";

/**
 * Initializes and returns an instance of the GoogleGenAI client.
 * It uses exclusively the client-provided API key.
 * Returns null and logs a warning if no key is found.
 */
export const getAiClient = (clientApiKey?: string): GoogleGenAI | null => {
    // Use client key exclusively.
    if (clientApiKey) {
        return new GoogleGenAI({ apiKey: clientApiKey });
    }

    // If no key is available.
    console.warn("Nenhuma chave de API do Gemini foi fornecida.");
    return null;
};