import OpenAI from 'openai';

let aiClient: OpenAI | null = null;

/**
 * Initializes and returns a singleton instance of the OpenRouter client.
 * It uses an OpenAI-compatible API structure.
 * Returns null and logs an error if the API key is not found.
 */
export const getOpenRouterClient = (): OpenAI | null => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        // This is not an error, just means we'll fall back to OpenAI
        return null;
    }

    if (!aiClient) {
        aiClient = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: apiKey,
            defaultHeaders: {
                'HTTP-Referer': 'https://github.com/SoftMissT/Demon_slayer_gerador', 
                'X-Title': 'Kimetsu Forge',
            },
        });
    }

    return aiClient;
};
