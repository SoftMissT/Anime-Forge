// src/contexts/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { 
    fetchCreations, 
    updateCreationFavoriteStatus, 
    deleteCreationById, 
    clearAllCreationsForUser
} from '../lib/client/orchestrationService';
import type { 
    AppView, AppError, LoadingState, FilterState, GeneratedItem, User, HistoryItem, MidjourneyParameters, GptParameters, GeminiParameters, AlchemyHistoryItem, MasterToolItem, CosmakerItem, FilmmakerItem
} from '../types';
import { Spinner } from '../components/ui/Spinner';
import { supabase } from '../lib/supabaseClient';

// ===== INITIAL STATES =====
const initialFilters: FilterState = {
    category: 'Arma',
    rarity: 'Aleatória',
    level: 10,
    promptModifier: '',
    quantity: 1,
    thematics: [],
    tonalidade: 'Aleatória',
    country: 'Aleatório',
};

const initialMjParams: MidjourneyParameters = {
    aspectRatio: { active: false, value: '16:9' },
    chaos: { active: false, value: 10 },
    quality: { active: false, value: 1 },
    style: { active: false, value: '' },
    stylize: { active: false, value: 250 },
    version: { active: false, value: '6.0' },
    weird: { active: false, value: 250 },
};
const initialGptParams: GptParameters = {
    tone: 'Cinematic', style: 'Concept Art', composition: 'Dynamic Angle'
};
const initialGeminiParams: GeminiParameters = {
    artStyle: "Anime/Manga",
    lighting: "Cinematic Lighting",
    colorPalette: "Vibrant",
    composition: "Dynamic Angle",
    detailLevel: "Detailed",
};


// ===== CORE UI CONTEXT =====
interface CoreUIContextType {
  activeView: AppView;
  changeView: (view: AppView) => void;
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
  openLibraryTome: (initialState: { view: AppView; tab: 'history' | 'favorites' }) => void;
  closeLibraryTome: () => void;
  libraryTomeInitialState: { view: AppView; tab: 'history' | 'favorites' };
  appError: AppError | null;
  setAppError: React.Dispatch<React.SetStateAction<AppError | null>>;
  loadingState: LoadingState;
  setLoadingState: (state: LoadingState) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}
const CoreUIContext = createContext<CoreUIContextType | undefined>(undefined);

export const CoreUIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<AppView>('forge');
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const [isHowItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [isApiKeysModalOpen, setApiKeysModalOpen] = useState(false);
  const [isLibraryTomeOpen, setLibraryTomeOpen] = useState(false);
  const [libraryTomeInitialState, setLibraryTomeInitialState] = useState<{ view: AppView; tab: 'history' | 'favorites' }>({ view: 'forge', tab: 'history' });
  const [appError, setAppError] = useState<AppError | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({ active: false });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const changeView = useCallback((view: AppView) => setActiveView(view), []);
  const openAboutModal = useCallback(() => setAboutModalOpen(true), []);
  const closeAboutModal = useCallback(() => setAboutModalOpen(false), []);
  const openHowItWorksModal = useCallback(() => setHowItWorksModalOpen(true), []);
  const closeHowItWorksModal = useCallback(() => setHowItWorksModalOpen(false), []);
  const openApiKeysModal = useCallback(() => setApiKeysModalOpen(true), []);
  const closeApiKeysModal = useCallback(() => setApiKeysModalOpen(false), []);
  const openLibraryTome = useCallback((initialState: { view: AppView; tab: 'history' | 'favorites' }) => {
    setLibraryTomeInitialState(initialState);
    setLibraryTomeOpen(true);
  }, []);
  const closeLibraryTome = useCallback(() => setLibraryTomeOpen(false), []);
  const toggleSidebar = useCallback(() => setIsSidebarCollapsed(prev => !prev), []);

  const value = useMemo(() => ({
      activeView, changeView, isAboutModalOpen, openAboutModal, closeAboutModal,
      isHowItWorksModalOpen, openHowItWorksModal, closeHowItWorksModal,
      isApiKeysModalOpen, openApiKeysModal, closeApiKeysModal, isLibraryTomeOpen, 
      openLibraryTome, closeLibraryTome, libraryTomeInitialState,
      appError, setAppError, loadingState, setLoadingState,
      isSidebarCollapsed, toggleSidebar
  }), [
    activeView, changeView, isAboutModalOpen, openAboutModal, closeAboutModal,
    isHowItWorksModalOpen, openHowItWorksModal, closeHowItWorksModal,
    isApiKeysModalOpen, openApiKeysModal, closeApiKeysModal, isLibraryTomeOpen,
    openLibraryTome, closeLibraryTome, libraryTomeInitialState, appError, loadingState,
    isSidebarCollapsed, toggleSidebar
  ]);

  return <CoreUIContext.Provider value={value}>{children}</CoreUIContext.Provider>;
};
export const useAppCore = () => {
  const context = useContext(CoreUIContext);
  if (!context) throw new Error('useAppCore must be used within a CoreUIProvider');
  return context;
};

// ===== AUTH CONTEXT (Supabase) =====
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  sessionToken: string | null;
  handleLoginClick: () => void;
  handleLogout: () => void;
  isDataLoading: boolean; 
  setDataLoading: (loading: boolean) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const { setAppError } = useAppCore();
    const [isAuthLoading, setAuthLoading] = useState(true);
    const [isDataLoading, setDataLoading] = useState(false);

    useEffect(() => {
        // Safe check for supabase instance
        if (!supabase) {
            console.warn("Supabase client not initialized. Auth disabled.");
            setAuthLoading(false);
            return;
        }

        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                const mappedUser: User = {
                    id: session.user.id,
                    username: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Viajante',
                    avatar: session.user.user_metadata?.avatar_url || 'https://i.imgur.com/M9BDKmO.png',
                };
                setUser(mappedUser);
                setSessionToken(session.access_token);
            }
            setAuthLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                 const mappedUser: User = {
                    id: session.user.id,
                    username: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Viajante',
                    avatar: session.user.user_metadata?.avatar_url || 'https://i.imgur.com/M9BDKmO.png',
                };
                setUser(mappedUser);
                setSessionToken(session.access_token);
            } else {
                setUser(null);
                setSessionToken(null);
            }
            setAuthLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLoginClick = useCallback(async () => {
        if (!supabase) {
            setAppError({ message: "Serviço de autenticação indisponível." });
            return;
        }
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'discord',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            setAppError({ message: "Falha na Autenticação", details: error.message });
        }
    }, [setAppError]);

    const handleLogout = useCallback(async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
        setSessionToken(null);
    }, []);

    const value = useMemo(() => ({
        isAuthenticated: !!user, 
        user, 
        sessionToken,
        handleLoginClick, 
        handleLogout, 
        isDataLoading, 
        setDataLoading
    }), [user, sessionToken, handleLoginClick, handleLogout, isDataLoading]);

    if (isAuthLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
                <Spinner size="lg" />
                <p className="mt-4 text-lg">Iniciando a Forja...</p>
            </div>
        );
    }
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

// ===== API KEYS CONTEXT =====
interface ApiKeysContextType {
    geminiApiKey: string; setGeminiApiKey: (key: string) => void;
    openaiApiKey: string; setOpenaiApiKey: (key: string) => void;
    deepseekApiKey: string; setDeepseekApiKey: (key: string) => void;
}
const ApiKeysContext = createContext<ApiKeysContextType | undefined>(undefined);
export const ApiKeysProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [geminiApiKey, setGeminiApiKey] = useState('');
    const [openaiApiKey, setOpenaiApiKey] = useState('');
    const [deepseekApiKey, setDeepseekApiKey] = useState('');

    useEffect(() => {
        const fetchKeys = async () => {
            if (user?.id) {
                try {
                    const response = await fetch(`/api/keys/get?userId=${user.id}`);
                    if (response.ok) {
                        const keys = await response.json();
                        setGeminiApiKey(keys.gemini || '');
                        setOpenaiApiKey(keys.openai || '');
                        setDeepseekApiKey(keys.deepseek || '');
                    }
                } catch (error) {
                    console.error("Failed to fetch user API keys:", error);
                }
            } else {
                // Clear keys on logout
                setGeminiApiKey('');
                setOpenaiApiKey('');
                setDeepseekApiKey('');
            }
        };
        fetchKeys();
    }, [user]);

    const value = useMemo(() => ({
        geminiApiKey, setGeminiApiKey,
        openaiApiKey, setOpenaiApiKey,
        deepseekApiKey, setDeepseekApiKey,
    }), [geminiApiKey, openaiApiKey, deepseekApiKey]);

    return <ApiKeysContext.Provider value={value}>{children}</ApiKeysContext.Provider>;
};
export const useApiKeys = () => {
    const context = useContext(ApiKeysContext);
    if (!context) throw new Error('useApiKeys must be used within an ApiKeysProvider');
    return context;
};

// ===== USAGE CONTEXT =====
interface UsageContextType {
    usageCount: number;
    resetTimestamp: number;
    decrementUsage: () => void;
}
const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const UsageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const USAGE_LIMIT = 10;
    const USAGE_RESET_HOURS = 24;

    const [usage, setUsage] = useLocalStorage<{ count: number; reset: number }>('kimetsu-forge-usage', {
        count: USAGE_LIMIT,
        reset: Date.now() + USAGE_RESET_HOURS * 60 * 60 * 1000,
    });

    useEffect(() => {
        const checkReset = () => {
            if (Date.now() > usage.reset) {
                setUsage({
                    count: USAGE_LIMIT,
                    reset: Date.now() + USAGE_RESET_HOURS * 60 * 60 * 1000,
                });
            }
        };
        checkReset();
        const interval = setInterval(checkReset, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [usage, setUsage]);

    const decrementUsage = useCallback(() => {
        setUsage(prev => ({ ...prev, count: Math.max(0, prev.count - 1) }));
    }, [setUsage]);
    
    const value = useMemo(() => ({
        usageCount: usage.count,
        resetTimestamp: usage.reset,
        decrementUsage,
    }), [usage, decrementUsage]);

    return <UsageContext.Provider value={value}>{children}</UsageContext.Provider>;
}

export const useUsage = () => {
    const context = useContext(UsageContext);
    if (!context) throw new Error('useUsage must be used within a UsageProvider');
    return context;
};

// ===== ALCHEMY CONTEXT =====
interface AlchemyContextType {
    basePrompt: string; setBasePrompt: (p: string) => void;
    negativePrompt: string; setNegativePrompt: (p: string) => void;
    mjParams: MidjourneyParameters; setMjParams: React.Dispatch<React.SetStateAction<MidjourneyParameters>>;
    gptParams: GptParameters; setGptParams: React.Dispatch<React.SetStateAction<GptParameters>>;
    geminiParams: GeminiParameters; setGeminiParams: React.Dispatch<React.SetStateAction<GeminiParameters>>;
    history: AlchemyHistoryItem[];
    addHistoryItem: (item: AlchemyHistoryItem) => void;
    selectedItem: AlchemyHistoryItem | null;
    setSelectedItem: (item: AlchemyHistoryItem | null) => void;
}
const AlchemyContext = createContext<AlchemyContextType | undefined>(undefined);

export const AlchemyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [basePrompt, setBasePrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [mjParams, setMjParams] = useState<MidjourneyParameters>(initialMjParams);
    const [gptParams, setGptParams] = useState<GptParameters>(initialGptParams);
    const [geminiParams, setGeminiParams] = useState<GeminiParameters>(initialGeminiParams);
    const [history, setHistory] = useLocalStorage<AlchemyHistoryItem[]>('alchemy-history', []);
    const [selectedItem, setSelectedItem] = useState<AlchemyHistoryItem | null>(null);

    const addHistoryItem = useCallback((item: AlchemyHistoryItem) => {
        setHistory(prev => [item, ...prev.filter(h => h.id !== item.id)]);
    }, [setHistory]);

    const value = useMemo(() => ({
        basePrompt, setBasePrompt,
        negativePrompt, setNegativePrompt,
        mjParams, setMjParams,
        gptParams, setGptParams,
        geminiParams, setGeminiParams,
        history, addHistoryItem,
        selectedItem, setSelectedItem
    }), [basePrompt, negativePrompt, mjParams, gptParams, geminiParams, history, addHistoryItem, selectedItem]);

    return <AlchemyContext.Provider value={value}>{children}</AlchemyContext.Provider>;
};

export const useAlchemy = () => {
    const context = useContext(AlchemyContext);
    if (!context) throw new Error('useAlchemy must be used within an AlchemyProvider');
    return context;
};


// ===== FORGE CONTEXT =====
interface ForgeContextType {
    filters: FilterState;
    handleFilterChange: <K extends keyof FilterState>(field: K, value: FilterState[K]) => void;
    resetFilters: () => void;
    history: GeneratedItem[];
    addHistoryItem: (item: GeneratedItem) => void;
    deleteHistoryItem: (id: string) => void;
    clearHistory: () => void;
    favorites: GeneratedItem[];
    toggleFavorite: (item: GeneratedItem) => void;
    setFavorites: React.Dispatch<React.SetStateAction<GeneratedItem[]>>;
    selectedItem: GeneratedItem | null;
    setSelectedItem: (item: GeneratedItem | null) => void;
}
const ForgeContext = createContext<ForgeContextType | undefined>(undefined);

export const ForgeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, sessionToken, setDataLoading, isDataLoading } = useAuth();
  const { setAppError } = useAppCore();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [history, setHistory] = useState<GeneratedItem[]>([]);
  const [favorites, setFavorites] = useState<GeneratedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);

  useEffect(() => {
    const loadData = async () => {
        if (user && sessionToken) {
            setDataLoading(true);
            try {
                const { history: allHistory, favorites: allFavorites } = await fetchCreations(sessionToken);
                setHistory(allHistory as GeneratedItem[]);
                setFavorites(allFavorites as GeneratedItem[]);
            } catch (err: any) {
                console.warn("Erro ao carregar dados, pode ser primeira sessão:", err.message);
                // Non-blocking error for new users
            } finally {
                setDataLoading(false);
            }
        } else {
            setHistory([]);
            setFavorites([]);
            setSelectedItem(null);
            setDataLoading(false);
        }
    };
    loadData();
  }, [user, sessionToken, setAppError, setDataLoading]);

  const handleFilterChange = useCallback(<K extends keyof FilterState>(field: K, value: FilterState[K]) => {
      setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetFilters = useCallback(() => setFilters(prev => ({...initialFilters, category: prev.category})), []);
  
  const addHistoryItem = useCallback((item: GeneratedItem) => {
    setHistory(prev => [item, ...prev.filter(h => h.id !== item.id)]);
  }, []);

  const deleteHistoryItem = useCallback(async (id: string) => {
    if (!user || !sessionToken) return;
    setHistory(prev => prev.filter(item => item.id !== id));
    setFavorites(prev => prev.filter(item => item.id !== id));
    try {
        await deleteCreationById(id, sessionToken);
    } catch (err: any) {
        setAppError({ message: "Erro ao deletar item", details: err.message });
    }
  }, [user, sessionToken, setAppError]);

  const clearHistory = useCallback(async () => {
    if (!user || !sessionToken) return;
    setHistory([]);
    try {
        await clearAllCreationsForUser(sessionToken);
    } catch (err: any) {
        setAppError({ message: "Erro ao limpar histórico", details: err.message });
    }
  }, [user, sessionToken, setAppError]);

  const toggleFavorite = useCallback(async (item: GeneratedItem) => {
    if (!user || !sessionToken) return;
    const isFav = favorites.some(f => f.id === item.id);
    setFavorites(prev => isFav ? prev.filter(f => f.id !== item.id) : [item, ...prev]);
    try {
        await updateCreationFavoriteStatus(item, !isFav, sessionToken);
    } catch (err: any) {
        setAppError({ message: "Erro ao atualizar favoritos", details: err.message });
    }
  }, [user, sessionToken, favorites, setAppError]);
  
  const value = useMemo(() => ({
    filters, handleFilterChange, resetFilters, history, addHistoryItem,
    deleteHistoryItem, clearHistory, favorites, toggleFavorite, setFavorites,
    selectedItem, setSelectedItem
  }), [filters, handleFilterChange, resetFilters, history, addHistoryItem,
    deleteHistoryItem, clearHistory, favorites, toggleFavorite, selectedItem]);
    
  if(isDataLoading && user) {
     return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
                <Spinner size="lg" />
                <p className="mt-4 text-lg">Carregando grimório da Forja...</p>
            </div>
        );
  }

  return <ForgeContext.Provider value={value}>{children}</ForgeContext.Provider>;
};
export const useForge = () => {
    const context = useContext(ForgeContext);
    if (!context) throw new Error('useForge must be used within a ForgeProvider');
    return context;
};

// FIX: Add placeholder providers for views that don't have their own context yet.
export const ConflictsProvider: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
export const CharactersProvider: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
export const TechniquesProvider: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;
export const LocationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => <>{children}</>;

// FIX: Add stateful providers for MasterTools, Cosmaker, and Filmmaker
interface MasterToolsContextType {
  history: MasterToolItem[];
  setHistory: React.Dispatch<React.SetStateAction<MasterToolItem[]>>;
  toggleFavorite: (item: MasterToolItem) => void;
}
const MasterToolsContext = createContext<MasterToolsContextType | undefined>(undefined);

export const MasterToolsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useLocalStorage<MasterToolItem[]>('master-tools-history', []);
  const toggleFavorite = useCallback((item: MasterToolItem) => {
    setHistory(prev => prev.map(h => h.id === item.id ? { ...h, isFavorite: !h.isFavorite } : h));
  }, [setHistory]);
  const value = useMemo(() => ({ history, setHistory, toggleFavorite }), [history, setHistory, toggleFavorite]);
  return <MasterToolsContext.Provider value={value}>{children}</MasterToolsContext.Provider>;
};
export const useMasterTools = () => {
  const context = useContext(MasterToolsContext);
  if (!context) throw new Error('useMasterTools must be used within a MasterToolsProvider');
  return context;
};

interface CosmakerContextType {
  history: CosmakerItem[];
  setHistory: React.Dispatch<React.SetStateAction<CosmakerItem[]>>;
  toggleFavorite: (item: CosmakerItem) => void;
}
const CosmakerContext = createContext<CosmakerContextType | undefined>(undefined);

export const CosmakerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useLocalStorage<CosmakerItem[]>('cosmaker-history', []);
  const toggleFavorite = useCallback((item: CosmakerItem) => {
    setHistory(prev => prev.map(h => h.id === item.id ? { ...h, isFavorite: !h.isFavorite } : h));
  }, [setHistory]);
  const value = useMemo(() => ({ history, setHistory, toggleFavorite }), [history, setHistory, toggleFavorite]);
  return <CosmakerContext.Provider value={value}>{children}</CosmakerContext.Provider>;
};
export const useCosmaker = () => {
  const context = useContext(CosmakerContext);
  if (!context) throw new Error('useCosmaker must be used within a CosmakerProvider');
  return context;
};


interface FilmmakerContextType {
  history: FilmmakerItem[];
  setHistory: React.Dispatch<React.SetStateAction<FilmmakerItem[]>>;
  toggleFavorite: (item: FilmmakerItem) => void;
}
const FilmmakerContext = createContext<FilmmakerContextType | undefined>(undefined);

export const FilmmakerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useLocalStorage<FilmmakerItem[]>('filmmaker-history', []);
  const toggleFavorite = useCallback((item: FilmmakerItem) => {
    setHistory(prev => prev.map(h => h.id === item.id ? { ...h, isFavorite: !h.isFavorite } : h));
  }, [setHistory]);
  const value = useMemo(() => ({ history, setHistory, toggleFavorite }), [history, setHistory, toggleFavorite]);
  return <FilmmakerContext.Provider value={value}>{children}</FilmmakerContext.Provider>;
};
export const useFilmmaker = () => {
  const context = useContext(FilmmakerContext);
  if (!context) throw new Error('useFilmmaker must be used within a FilmmakerProvider');
  return context;
};
