

import OpenAI from 'openai';

/**
 * Initializes and returns an instance of the OpenAI client.
 * It uses exclusively the client-provided API key.
 * Returns null and logs a warning if no key is found.
 */
export const getOpenAiClient = (clientApiKey?: string): OpenAI | null => {
    // Use client key exclusively.
    if (clientApiKey) {
        return new OpenAI({ apiKey: clientApiKey });
    }
    
    console.warn("Nenhuma chave de API da OpenAI foi fornecida. O refinamento com GPT será ignorado.");
    return null;
};