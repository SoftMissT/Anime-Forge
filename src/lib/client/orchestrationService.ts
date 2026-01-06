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
import { generateContentClient, ApiKeys } from './generationLogic';
import { supabase } from '../supabase';

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
  keys: ApiKeys
): Promise<GeneratedItem> => {
  return generateContentClient(filters, promptModifier, keys);
};

export const analyzeFeat = async (description: string): Promise<MasterToolResult> => {
    // TODO: Client-side AI Logic for Master Tools
    throw new Error("Master Tool AI not yet implemented on client.");
};

// --- FUNÇÕES DE HISTÓRICO DA FERRAMENTA DO MESTRE ---
export const fetchMasterToolsHistory = async (): Promise<MasterToolHistoryItem[]> => {
    const { data } = await supabase.from('master_tool_history').select('*');
    return (data as any) || [];
};

export const clearMasterToolsHistory = async (): Promise<{ message: string }> => {
    await supabase.from('master_tool_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    return { message: 'History cleared' };
};


// --- FUNÇÕES PARA PERSISTÊNCIA (FORJA) ---
export const fetchCreations = async (): Promise<{ history: HistoryItem[], favorites: HistoryItem[] }> => {
     // TODO: Load from Supabase
    return { history: [], favorites: [] };
};

export const updateCreation = async (id: string, updateData: Partial<GeneratedItem>) => {
    // TODO: Update in Supabase if persisted there
    console.warn("updateCreation not fully implemented (state is local).");
    return { success: true };
};

export const updateCreationFavoriteStatus = async (item: HistoryItem, is_favorite: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    if (is_favorite) {
         await supabase.from('favorites').upsert({
            user_id: user.id,
            item_id: item.id,
            item_data: item,
            created_at: new Date().toISOString()
        });
    } else {
        await supabase.from('favorites').delete().eq('item_id', item.id).eq('user_id', user.id);
    }
    return { success: true };
};

export const deleteCreationById = async (id: string) => {
    // TODO: Delete from Supabase
    return { success: true };
};

export const clearAllCreationsForUser = async () => {
    // TODO: Clear Supabase
    return { success: true };
};

// --- ALCHEMY FUNCTIONS ---
export const generatePrompts = async (params: any, keys: ApiKeys): Promise<PromptGenerationResult> => {
     // TODO: Client logic
     throw new Error("Alchemy not implemented.");
};

export const refinePromptWithDeepSeek = async (prompt: string, keys: ApiKeys): Promise<{ refinedPrompt?: string }> => {
    // TODO: Client logic
    throw new Error("Refinement not implemented.");
};

// --- IMAGE & VIDEO FUNCTIONS ---
export const generateImage = async (params: Omit<GenerateImageRequest, 'user'>): Promise<{ image: string }> => {
    throw new Error("Image generation removed via User Request.");
};

export const generateAndAssignImage = async (params: Omit<GenerateImageRequest, 'user'>): Promise<{ updatedItem: GeneratedItem }> => {
     throw new Error("Image generation removed via User Request.");
};


export const startVideoGeneration = async (params: VideoGenerationParams): Promise<any> => {
    throw new Error("Video generation removed via User Request.");
};

export const checkVideoGenerationStatus = async (operation: any, user: User): Promise<VideoOperationStatus> => {
     throw new Error("Video generation removed via User Request.");
};