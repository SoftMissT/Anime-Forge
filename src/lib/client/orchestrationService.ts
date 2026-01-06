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

// --- GENERATION (Client Side) ---

export const orchestrateGeneration = async (
  filters: FilterState,
  promptModifier: string,
  keys: ApiKeys
): Promise<GeneratedItem> => {
  return generateContentClient(filters, promptModifier, keys);
};

// --- MASTER TOOLS (Client Side stub - requires migration to generationLogic prompts) ---
export const analyzeFeat = async (description: string, keys: ApiKeys): Promise<MasterToolResult> => {
    // TODO: Implement simple prompt call using keys.
    // For now throwing error to prompt implementation
    throw new Error("Master Tools migration to client-side pending.");
};

export const fetchMasterToolsHistory = async (): Promise<MasterToolHistoryItem[]> => {
    // Fetch from Supabase
    // Assuming table 'master_tool_history'
    const { data, error } = await supabase.from('master_tool_history').select('*').order('created_at', { ascending: false });
    if (error) {
        console.warn('Failed to fetch master tool history', error);
        return [];
    }
    return data as any || [];
};

export const clearMasterToolsHistory = async (): Promise<{ message: string }> => {
    const { error } = await supabase.from('master_tool_history').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all? Warning: RLS should handle user scoping
    if (error) throw error;
    return { message: 'History cleared' };
};


// --- PERSISTÊNCIA (Supabase) ---
// Forge History should ideally be stored in Supabase 'creations' table.
// But mostly the app uses local state in ForgeProvider for session history,
// and 'favorites' for persisted.
// If we want to persist history, we need to update ForgeProvider to load from Supabase.
// For now, we only changed generation to be client side.

export const updateCreationFavoriteStatus = async (item: HistoryItem, is_favorite: boolean) => {
    // Upsert into favorites/creations table
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return; // Can't save if not logged in

    if (is_favorite) {
        const { error } = await supabase.from('favorites').upsert({
            user_id: user.id,
            item_id: item.id,
            item_data: item,
            created_at: new Date().toISOString()
        });
        if (error) console.error('Error saving favorite', error);
    } else {
        const { error } = await supabase.from('favorites').delete().eq('item_id', item.id).eq('user_id', user.id);
         if (error) console.error('Error removing favorite', error);
    }
    return { success: true };
};

// --- ALCHEMY FUNCTIONS ---
export const generatePrompts = async (params: any, keys: ApiKeys): Promise<PromptGenerationResult> => {
    // TODO: Implement using keys
     throw new Error("Alchemy generation pending migration.");
};

export const refinePromptWithDeepSeek = async (prompt: string, keys: ApiKeys): Promise<{ refinedPrompt?: string }> => {
    // TODO: Implement using keys.deepseek and callDeepSeekAPI
     throw new Error("DeepSeek refinement pending migration.");
};

// --- IMAGE & VIDEO FUNCTIONS (Removido/Pending) ---
export const generateImage = async (params: any): Promise<{ image: string }> => {
    throw new Error("Image generation disabled (NanoBanana removed).");
};

export const startVideoGeneration = async (params: any): Promise<any> => {
     throw new Error("Video generation disabled.");
};

export const checkVideoGenerationStatus = async (operation: any, user: User): Promise<VideoOperationStatus> => {
    return { done: true, error: "Service disabled" } as any;
};