
// FIX: Exported the DeepSeekMessage interface to allow for strong typing in API route handlers, resolving role type inference issues.
export interface DeepSeekMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

/**
 * Calls the DeepSeek API with a given set of messages.
 * Throws an error if the API key is missing or if the API call fails.
 * Attempts to parse a JSON object from the response.
 * @param messages The messages to send to the DeepSeek API.
 * @param clientApiKey An optional user-provided API key.
 */
export const callDeepSeekAPI = async (messages: DeepSeekMessage[], clientApiKey?: string): Promise<any> => {
    const apiKey = clientApiKey;

    if (!apiKey) {
        throw new Error('Nenhuma chave de API da DeepSeek foi fornecida pelo usuário.');
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: messages,
            temperature: 0.7,
            stream: false,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('DeepSeek API Error:', errorData);
        throw new Error(errorData.error?.message || `Erro na API do DeepSeek: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    if (!content) {
        throw new Error('A resposta da API do DeepSeek estava vazia ou em formato inválido.');
    }
    
    // The response might be inside a JSON block or just raw JSON
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/s);
    if (jsonMatch && (jsonMatch[1] || jsonMatch[2])) {
        try {
            return JSON.parse(jsonMatch[1] || jsonMatch[2]);
        } catch (e) {
            console.error("Falha ao analisar JSON da resposta do DeepSeek (bloco de código):", content);
            throw new Error("A resposta do DeepSeek não era um JSON válido.");
        }
    }
    
    // Fallback for raw JSON without markdown
    try {
        return JSON.parse(content);
    } catch (e) {
        // If it's not JSON, it might be the raw text refinement, which is a valid use case.
        return content;
    }
};
