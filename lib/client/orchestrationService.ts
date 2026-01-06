// lib/client/orchestrationService.ts
import type {
  FilterState,
  GeneratedItem,
  User,
  MasterToolResult,
  HistoryItem,
  MasterToolHistoryItem,
  PromptGenerationResult,
  VideoGenerationParams,
  VideoOperationStatus,
  GenerateImageRequest,
} from '../../types';
import { generateStableItem } from '../generationValidator';

const API_BASE = '/api';

// Helper to handle API responses and parse errors
async function handleApiResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.details || data.message || 'Erro desconhecido da API.');
    }
    return data;
}

export const orchestrateGeneration = async (
  filters: FilterState,
  promptModifier: string,
): Promise<GeneratedItem> => {
  const response = await fetch(`${API_BASE}/generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filters, promptModifier }),
  });
  return handleApiResponse(response);
};

export const analyzeFeat = async (description: string): Promise<MasterToolResult> => {
    const response = await fetch(`${API_BASE}/masterTools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
    });
    return handleApiResponse(response);
};

// --- FUNÇÕES DE HISTÓRICO DA FERRAMENTA DO MESTRE ---
export const fetchMasterToolsHistory = async (): Promise<MasterToolHistoryItem[]> => {
    const response = await fetch(`${API_BASE}/masterToolsHistory`, {
        method: 'GET',
    });
    return handleApiResponse(response);
};

export const clearMasterToolsHistory = async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE}/masterToolsHistory`, {
        method: 'DELETE',
    });
    return handleApiResponse(response);
};


// --- FUNÇÕES PARA PERSISTÊNCIA (FORJA) ---
export const fetchCreations = async (): Promise<{ history: HistoryItem[], favorites: HistoryItem[] }> => {
    const response = await fetch(`${API_BASE}/creations`, {
        method: 'GET',
    });
    return handleApiResponse(response);
};

export const updateCreation = async (id: string, updateData: Partial<GeneratedItem>) => {
    const response = await fetch(`${API_BASE}/creations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updateData }),
    });
    return handleApiResponse(response);
};

export const updateCreationFavoriteStatus = async (item: HistoryItem, is_favorite: boolean) => {
    const response = await fetch(`${API_BASE}/creations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item, is_favorite }),
    });
    return handleApiResponse(response);
};

export const deleteCreationById = async (id: string) => {
    const response = await fetch(`${API_BASE}/creations?id=${id}`, {
        method: 'DELETE',
    });
    return handleApiResponse(response);
};

export const clearAllCreationsForUser = async () => {
    const response = await fetch(`${API_BASE}/creations?clearAll=true`, {
        method: 'DELETE',
    });
    return handleApiResponse(response);
};

// --- ALCHEMY FUNCTIONS ---
export const generatePrompts = async (params: any): Promise<PromptGenerationResult> => {
    const response = await fetch(`${API_BASE}/generatePrompts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    return handleApiResponse(response);
};

export const refinePromptWithDeepSeek = async (prompt: string): Promise<{ refinedPrompt?: string }> => {
    const response = await fetch(`${API_BASE}/refinePromptWithDeepSeek`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    });
    return handleApiResponse(response);
};

// --- IMAGE & VIDEO FUNCTIONS ---
export const generateImage = async (params: Omit<GenerateImageRequest, 'user'>): Promise<{ image: string }> => {
    const response = await fetch(`${API_BASE}/generateImage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    return handleApiResponse(response);
};

export const generateAndAssignImage = async (params: Omit<GenerateImageRequest, 'user'>): Promise<{ updatedItem: GeneratedItem }> => {
    const response = await fetch(`${API_BASE}/generateImage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    return handleApiResponse(response);
};


// FIX: Modified function to accept full VideoGenerationParams, including the user object.
export const startVideoGeneration = async (params: VideoGenerationParams): Promise<any> => {
    const response = await fetch(`${API_BASE}/generateVideo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
    });
    return (await handleApiResponse(response)).operation;
};

// FIX: Modified function to accept and pass the user object for authentication.
export const checkVideoGenerationStatus = async (operation: any, user: User): Promise<VideoOperationStatus> => {
    const response = await fetch(`${API_BASE}/getVideoStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation, user }),
    });
    return handleApiResponse(response);
};