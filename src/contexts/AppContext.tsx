import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Types ---
interface AppCoreContextType {
  activeView: string;
  setActiveView: (view: string) => void;
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
  appError: any;
  setAppError: (error: any) => void;
}

interface ForgeContextType {
  selectedItem: any;
  setSelectedItem: (item: any) => void;
  favorites: any[];
  toggleFavorite: (item: any) => void;
  history: any[];
  addToHistory: (item: any) => void;
}

// --- Contexts ---
const AppCoreContext = createContext<AppCoreContextType | undefined>(undefined);
const ForgeContext = createContext<ForgeContextType | undefined>(undefined);
const AuthContext = createContext<any>({});
const ApiKeysContext = createContext<any>({});
const UsageContext = createContext<any>({});
const AlchemyContext = createContext<any>({});

// --- Providers ---

export const CoreUIProvider = ({ children }: { children: ReactNode }) => {
  const [activeView, setActiveView] = useState('forge');
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const [isHowItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [isApiKeysModalOpen, setApiKeysModalOpen] = useState(false);
  const [isLibraryTomeOpen, setLibraryTomeOpen] = useState(false);
  const [libraryTomeInitialState, setLibraryTomeInitialState] = useState(null);
  const [appError, setAppError] = useState(null);

  const value = {
    activeView,
    setActiveView,
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
  };

  return <AppCoreContext.Provider value={value}>{children}</AppCoreContext.Provider>;
};

export const ForgeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

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

  const value = {
    selectedItem,
    setSelectedItem,
    favorites,
    toggleFavorite,
    history,
    addToHistory
  };

  return <ForgeContext.Provider value={value}>{children}</ForgeContext.Provider>;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    return <AuthContext.Provider value={{ user: null }}>{children}</AuthContext.Provider>;
};

export const ApiKeysProvider = ({ children }: { children: ReactNode }) => {
    return <ApiKeysContext.Provider value={{ keys: {} }}>{children}</ApiKeysContext.Provider>;
};

export const UsageProvider = ({ children }: { children: ReactNode }) => {
    return <UsageContext.Provider value={{ usage: 0 }}>{children}</UsageContext.Provider>;
};

export const AlchemyProvider = ({ children }: { children: ReactNode }) => {
    return <AlchemyContext.Provider value={{ generate: () => {} }}>{children}</AlchemyContext.Provider>;
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

// --- Empty Providers for View Specific Contexts ---
// These are placeholders to prevent crashes in the existing App structure
export const ConflictsProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export const CharactersProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export const TechniquesProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export const LocationsProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export const MasterToolsProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export const CosmakerProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
export const FilmmakerProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
