// src/lib/client/orchestrationService.ts
import type {
  FilterState,
  GeneratedItem,
  MasterToolResult,
  HistoryItem,
  MasterToolHistoryItem,
  PromptGenerationResult,
} from '../../types';
import { supabase } from '../supabaseClient';

const API_BASE = '/api';

// Helper to handle API responses and parse errors
async function handleApiResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.details || data.message || 'Erro desconhecido da API.');
    }
    return data;
}

// Helper to get session token
const getAuthHeader = async (token?: string | null) => {
    let accessToken = token;
    if (!accessToken) {
        const { data } = await supabase.auth.getSession();
        accessToken = data.session?.access_token;
    }
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
}

// Text Generation (Forge, Characters, etc)
export const orchestrateGeneration = async (
  filters: FilterState,
  promptModifier: string,
): Promise<GeneratedItem> => {
  const headers = await getAuthHeader();
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ view: 'forge', filters, promptModifier }), 
  });
  return handleApiResponse(response);
};

// Master Tools (Analysis)
export const analyzeFeat = async (description: string): Promise<MasterToolResult> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE}/masterTools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ description }),
    });
    return handleApiResponse(response);
};

// Master Tools History
export const fetchMasterToolsHistory = async (): Promise<MasterToolHistoryItem[]> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE}/masterToolsHistory`, {
        method: 'GET',
        headers: { ...headers },
    });
    return handleApiResponse(response);
};

export const clearMasterToolsHistory = async (): Promise<{ message: string }> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE}/masterToolsHistory`, {
        method: 'DELETE',
        headers: { ...headers },
    });
    return handleApiResponse(response);
};

// Persistence (Creations)
export const fetchCreations = async (token?: string): Promise<{ history: HistoryItem[], favorites: HistoryItem[] }> => {
    const headers = await getAuthHeader(token);
    const response = await fetch(`${API_BASE}/creations`, {
        method: 'GET',
        headers: { ...headers },
    });
    return handleApiResponse(response);
};

export const updateCreation = async (id: string, updateData: Partial<GeneratedItem>) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE}/creations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ id, updateData }),
    });
    return handleApiResponse(response);
};

export const updateCreationFavoriteStatus = async (item: HistoryItem, is_favorite: boolean, token?: string) => {
    const headers = await getAuthHeader(token);
    const response = await fetch(`${API_BASE}/creations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ item, is_favorite }),
    });
    return handleApiResponse(response);
};

export const deleteCreationById = async (id: string, token?: string) => {
    const headers = await getAuthHeader(token);
    const response = await fetch(`${API_BASE}/creations?id=${id}`, {
        method: 'DELETE',
        headers: { ...headers },
    });
    return handleApiResponse(response);
};

export const clearAllCreationsForUser = async (token?: string) => {
    const headers = await getAuthHeader(token);
    const response = await fetch(`${API_BASE}/creations?clearAll=true`, {
        method: 'DELETE',
        headers: { ...headers },
    });
    return handleApiResponse(response);
};

// Alchemy (Prompt Engineering - Text to Text)
export const generatePrompts = async (params: any): Promise<PromptGenerationResult> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE}/generatePrompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(params),
    });
    return handleApiResponse(response);
};

export const refinePromptWithDeepSeek = async (prompt: string): Promise<{ refinedPrompt?: string }> => {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE}/refinePromptWithDeepSeek`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ prompt }),
    });
    return handleApiResponse(response);
};
