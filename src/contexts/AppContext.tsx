import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { 
  AppError, 
  LoadingState, 
  MidjourneyParameters, 
  GptParameters, 
  GeminiParameters, 
  AlchemyHistoryItem,
  User,
  AppView
} from '../types';

// --- Types ---
interface AppCoreContextType {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  changeView: (view: AppView) => void; // Alias
  isAboutModalOpen: boolean;
  openAboutModal: () => void;
  closeAboutModal: () => void;
  isHowItWorksModalOpen: boolean;
  openHowItWorksModal: () => void;
  closeHowItWorksModal: () => void;
  isApiKeysModalOpen: boolean;
  openApiKeysModal: () => void;
  closeApiKeysModal: () => void;
  isLibraryTomeOpen: boolean;
  openLibraryTome: (initialState?: any) => void;
  closeLibraryTome: () => void;
  libraryTomeInitialState: any;
  appError: AppError | null;
  setAppError: (error: AppError | null) => void;
  loadingState: LoadingState;
  setLoadingState: (state: LoadingState) => void;
}

interface ForgeContextType {
  selectedItem: any;
  setSelectedItem: (item: any) => void;
  favorites: any[];
  toggleFavorite: (item: any) => void;
  history: any[];
  addToHistory: (item: any) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  filters: any; // Using any to avoid importing FilterState here if possible, or assume it's imported
  handleFilterChange: (key: string, value: any) => void;
  resetFilters: () => void;
}

interface AlchemyContextType {
    basePrompt: string;
    setBasePrompt: (prompt: string) => void;
    negativePrompt: string;
    setNegativePrompt: (prompt: string) => void;
    mjParams: MidjourneyParameters;
    setMjParams: (params: any) => void; 
    gptParams: GptParameters;
    setGptParams: (params: any) => void;
    geminiParams: GeminiParameters;
    setGeminiParams: (params: any) => void;
    history: AlchemyHistoryItem[];
    addHistoryItem: (item: AlchemyHistoryItem) => void;
    selectedItem: AlchemyHistoryItem | null;
    setSelectedItem: (item: AlchemyHistoryItem | null) => void;
    generate: () => void;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    handleLoginClick: () => void;
    logout: () => void;
}

// --- Contexts ---
const AppCoreContext = createContext<AppCoreContextType | undefined>(undefined);
const ForgeContext = createContext<ForgeContextType | undefined>(undefined);
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ApiKeysContext = createContext<any>({});
const UsageContext = createContext<any>({});
const AlchemyContext = createContext<AlchemyContextType | undefined>(undefined);

// --- Providers ---

export const CoreUIProvider = ({ children }: { children: ReactNode }) => {
  const [activeView, setActiveView] = useState<AppView>('forge');
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const [isHowItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [isApiKeysModalOpen, setApiKeysModalOpen] = useState(false);
  const [isLibraryTomeOpen, setLibraryTomeOpen] = useState(false);
  const [libraryTomeInitialState, setLibraryTomeInitialState] = useState(null);
  const [appError, setAppError] = useState<AppError | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({ active: false });

  const value = {
    activeView,
    setActiveView,
    changeView: setActiveView,
    isAboutModalOpen,
    openAboutModal: () => setAboutModalOpen(true),
    closeAboutModal: () => setAboutModalOpen(false),
    isHowItWorksModalOpen,
    openHowItWorksModal: () => setHowItWorksModalOpen(true),
    closeHowItWorksModal: () => setHowItWorksModalOpen(false),
    isApiKeysModalOpen,
    openApiKeysModal: () => setApiKeysModalOpen(true),
    closeApiKeysModal: () => setApiKeysModalOpen(false),
    isLibraryTomeOpen,
    openLibraryTome: (initialState: any) => {
        setLibraryTomeInitialState(initialState);
        setLibraryTomeOpen(true);
    },
    closeLibraryTome: () => {
        setLibraryTomeOpen(false);
        setLibraryTomeInitialState(null);
    },
    libraryTomeInitialState,
    appError,
    setAppError,
    loadingState,
    setLoadingState,
  };

  return <AppCoreContext.Provider value={value}>{children}</AppCoreContext.Provider>;
};

export const ForgeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  
  // Default filter state
  const defaultFilters = {
      category: 'Arma',
      rarity: 'Aleatória',
      level: 1,
      promptModifier: '',
      quantity: 1,
      thematics: [],
      tonalidade: 'Equilibrada',
      country: 'Japão',
  };
  const [filters, setFilters] = useState<any>(defaultFilters);

  const toggleFavorite = (item: any) => {
    setFavorites(prev => {
        const exists = prev.find(i => i.id === item.id);
        if (exists) return prev.filter(i => i.id !== item.id);
        return [...prev, item];
    });
  };
  
    const addToHistory = (item: any) => {
    setHistory(prev => [item, ...prev]);
  };
  
    const deleteHistoryItem = (id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    };

    const clearHistory = () => {
        setHistory([]);
    };
    
    const handleFilterChange = (key: string, value: any) => {
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters(defaultFilters);
    };

  const value = {
    selectedItem,
    setSelectedItem,
    favorites,
    toggleFavorite,
    history,
    addToHistory,
    deleteHistoryItem,
    clearHistory,
    filters,
    handleFilterChange,
    resetFilters
  };

  return <ForgeContext.Provider value={value}>{children}</ForgeContext.Provider>;
};

import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const newUser: User = {
                    id: session.user.id,
                    username: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                    avatar: session.user.user_metadata.avatar_url || 'https://i.imgur.com/M9BDKmO.png'
                };
                setUser(newUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        });

        // Initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                const newUser: User = {
                    id: session.user.id,
                    username: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
                    avatar: session.user.user_metadata.avatar_url || 'https://i.imgur.com/M9BDKmO.png'
                };
                setUser(newUser);
                setIsAuthenticated(true);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLoginClick = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'discord',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = {
        user,
        isAuthenticated,
        handleLoginClick,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const ApiKeysProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [geminiApiKey, setGeminiApiKey] = useState('');
    const [openaiApiKey, setOpenaiApiKey] = useState('');
    const [deepseekApiKey, setDeepseekApiKey] = useState('');
    
    // Define save functions
    const updateUserKey = async (keyType: 'gemini_key' | 'openai_key' | 'deepseek_key', value: string) => {
        if (!user) return;
        
        try {
            // First check if profile exists, if not create it (this should idealy be handled by database triggers)
            const { error: upsertError } = await supabase
                .from('profiles')
                .upsert({ 
                    id: user.id,
                    username: user.username,
                    avatar_url: user.avatar,
                    updated_at: new Date().toISOString(),
                    [keyType]: value
                }, { onConflict: 'id' });
                
            if (upsertError) throw upsertError;
            
        } catch (error) {
            console.error(`Error saving ${keyType}:`, error);
        }
    };

    // Load keys when user logs in
    useEffect(() => {
        const loadKeys = async () => {
            if (!user) {
                setGeminiApiKey('');
                setOpenaiApiKey('');
                setDeepseekApiKey('');
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('gemini_key, openai_key, deepseek_key')
                    .eq('id', user.id)
                    .single();

                if (data && !error) {
                    if (data.gemini_key) setGeminiApiKey(data.gemini_key);
                    if (data.openai_key) setOpenaiApiKey(data.openai_key);
                    if (data.deepseek_key) setDeepseekApiKey(data.deepseek_key);
                }
            } catch (error) {
                console.error('Error loading API keys:', error);
            }
        };

        loadKeys();
    }, [user]);

    // Wrappers to update state and DB
    const updateGemini = (key: string) => {
        setGeminiApiKey(key);
        updateUserKey('gemini_key', key);
    };

    const updateOpenAI = (key: string) => {
        setOpenaiApiKey(key);
        updateUserKey('openai_key', key);
    };

    const updateDeepSeek = (key: string) => {
        setDeepseekApiKey(key);
        updateUserKey('deepseek_key', key);
    };

    const value = {
        geminiApiKey, setGeminiApiKey: updateGemini,
        openaiApiKey, setOpenaiApiKey: updateOpenAI,
        deepseekApiKey, setDeepseekApiKey: updateDeepSeek
    };

    return <ApiKeysContext.Provider value={value}>{children}</ApiKeysContext.Provider>;
};

export const UsageProvider = ({ children }: { children: ReactNode }) => {
    return <UsageContext.Provider value={{ usage: 0, resetTimestamp: Date.now() + 86400000 }}>{children}</UsageContext.Provider>;
};

export const AlchemyProvider = ({ children }: { children: ReactNode }) => {
    const [basePrompt, setBasePrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [mjParams, setMjParams] = useState<MidjourneyParameters>({
        aspectRatio: { active: true, value: '16:9' },
        chaos: { active: false, value: 0 },
        style: { active: false, value: 'raw' },
        stylize: { active: false, value: 100 },
        version: { active: true, value: '6' },
        weird: { active: false, value: 0 }
    });
    const [gptParams, setGptParams] = useState<GptParameters>({
        tone: 'Cinematic',
        style: 'Anime',
        composition: 'Detailed'
    });
    const [geminiParams, setGeminiParams] = useState<GeminiParameters>({
        artStyle: 'Anime',
        lighting: 'Dramatic',
        colorPalette: 'Vibrant',
        composition: 'Dynamic',
        detailLevel: 'High'
    });
    const [history, setHistory] = useState<AlchemyHistoryItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<AlchemyHistoryItem | null>(null);

    const addHistoryItem = (item: AlchemyHistoryItem) => {
        setHistory(prev => [item, ...prev]);
    };

    const value = {
        basePrompt, setBasePrompt,
        negativePrompt, setNegativePrompt,
        mjParams, setMjParams,
        gptParams, setGptParams,
        geminiParams, setGeminiParams,
        history, addHistoryItem,
        selectedItem, setSelectedItem,
        generate: () => {}
    };

    return <AlchemyContext.Provider value={value}>{children}</AlchemyContext.Provider>;
};

// --- Hooks ---
export const useAppCore = () => {
  const context = useContext(AppCoreContext);
  if (!context) throw new Error('useAppCore must be used within a CoreUIProvider');
  return context;
};

export const useForge = () => {
  const context = useContext(ForgeContext);
  if (!context) throw new Error('useForge must be used within a ForgeProvider');
  return context;
};

export const useAlchemy = () => {
  const context = useContext(AlchemyContext);
  if (!context) throw new Error('useAlchemy must be used within a AlchemyProvider');
  return context;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a AuthProvider');
  return context;
};

export const useApiKeys = () => {
  const context = useContext(ApiKeysContext);
  if (!context) throw new Error('useApiKeys must be used within a ApiKeysProvider');
  return context;
};

export const useUsage = () => {
    const context = useContext(UsageContext);
    if (!context) throw new Error('useUsage must be used within a UsageProvider');
    return context;
};

// --- Empty Providers for View Specific Contexts ---
export const ConflictsProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export const CharactersProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export const TechniquesProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export const LocationsProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export const MasterToolsProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export const CosmakerProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export const FilmmakerProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
