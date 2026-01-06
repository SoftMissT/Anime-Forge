

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForge, useAppCore, useAuth } from '../contexts/AppContext';
import type { GeneratedItem, HistoryItem, FavoriteItem, AppView, MasterToolHistoryItem, Category } from '../types';
import { VirtualizedList } from './ui/VirtualizedList';
import { ForgeIcon, StarIcon, HistoryIcon, BookIcon, TrashIcon, DownloadIcon, BrainIcon } from './icons';
import { useToast } from './ToastProvider';
import { analytics } from '../lib/analytics';
import { Button } from './ui/Button';
import { SearchableSelect } from './ui/SearchableSelect';
import { exportDataToGoogleDocs } from '../lib/client/exportService';
import { TABS_DATA } from '../lib/tabsData';
import { fetchMasterToolsHistory, clearMasterToolsHistory } from '../lib/client/orchestrationService';
import { Spinner } from './ui/Spinner';

interface LibraryTomeProps {
    isOpen: boolean;
    onClose: () => void;
    initialState: {
        view: AppView;
        tab: 'history' | 'favorites';
    }
}

const TomeListItem: React.FC<{ 
    item: GeneratedItem; 
    onSelect: (item: GeneratedItem) => void;
    onToggleFavorite: (item: FavoriteItem) => void;
    isFavorite: boolean;
}> = ({ item, onSelect, onToggleFavorite, isFavorite }) => {
    const name = item.nome;
    const date = new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' });
    const description = item.descricao_curta;
    const Icon = TABS_DATA.find(t => t.allowedCategories?.includes(item.categoria))?.icon || ForgeIcon;

    return (
        <div className="tome-list-item group" onClick={() => onSelect(item)}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-black/20 group-hover:bg-[var(--accent-start)]/20 transition-colors">
                       <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-text-primary truncate group-hover:text-white transition-colors">{name}</p>
                        <p className="text-xs text-text-secondary truncate mt-0.5">
                            {description}
                        </p>
                    </div>
                </div>
                 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-text-muted flex-shrink-0">{date}</span>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="!p-1.5"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(item);
                        }}
                    >
                        <StarIcon className={`w-4 h-4 ${isFavorite ? 'text-yellow-400' : 'text-gray-500'}`} filled={isFavorite} />
                    </Button>
                 </div>
            </div>
        </div>
    );
};

const MasterToolListItem: React.FC<{ item: MasterToolHistoryItem }> = ({ item }) => {
    const date = new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' });
    
    return (
        <div className="tome-list-item group">
            <div className="flex items-center gap-4 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-black/20">
                    <BrainIcon className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="min-w-0 flex-grow">
                    <p className="text-sm text-text-primary truncate" title={item.userInput}>"{item.userInput}"</p>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-white bg-indigo-500/20 px-2 py-0.5 rounded-md">{item.aiOutput.xp} XP</span>
                        <span className="text-xs text-text-muted flex-shrink-0">{date}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CATEGORY_MAP: Record<string, Category[]> = {
    'forge': ['Arma', 'Acessório'],
    'characters': ['Caçador', 'NPC', 'Inimigo/Oni'],
    'techniques': ['Respiração', 'Kekkijutsu'],
    'locations': ['Local/Cenário', 'Evento', 'Missões'],
    'conflicts': ['Guerra de Clãs'],
};

const categoryFilterOptions = [
    { value: 'all', label: 'Todas as Categorias' },
    ...TABS_DATA.filter(t => t.id !== 'master_tools' && t.id !== 'alchemist').map(tab => ({ value: tab.id, label: tab.name }))
];

export const LibraryTome: React.FC<LibraryTomeProps> = ({ isOpen, onClose, initialState }) => {
    const { history, favorites, setFavorites, setSelectedItem, clearHistory } = useForge();
    const { activeView: currentAppView, changeView } = useAppCore();
    const { user } = useAuth();
    const { showToast } = useToast();
    
    const [activeTab, setActiveTab] = useState<'history' | 'favorites'>(initialState.tab);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isExporting, setIsExporting] = useState<'docs' | false>(false);

    const [masterHistory, setMasterHistory] = useState<MasterToolHistoryItem[]>([]);
    const [isLoadingMasterHistory, setIsLoadingMasterHistory] = useState(false);

    const isMasterToolsView = initialState.view === 'master_tools';

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialState.tab);
            if (isMasterToolsView && user) {
                setIsLoadingMasterHistory(true);
                // FIX: Removed the `user` argument. The API endpoint handles user authentication via session cookies.
                fetchMasterToolsHistory()
                    .then(data => setMasterHistory(data))
                    .catch(err => showToast('error', 'Falha ao carregar histórico do mestre.'))
                    .finally(() => setIsLoadingMasterHistory(false));
            }
        }
    }, [isOpen, initialState, user, isMasterToolsView, showToast]);
    
    const favoriteIds = useMemo(() => new Set(favorites.map(fav => fav.id)), [favorites]);

    const handleToggleFavorite = useCallback((item: FavoriteItem) => {
        const isCurrentlyFavorite = favoriteIds.has(item.id);
        
        setFavorites(prev => isCurrentlyFavorite ? prev.filter(fav => fav.id !== item.id) : [item, ...prev]);
        showToast(isCurrentlyFavorite ? 'info' : 'success', isCurrentlyFavorite ? 'Removido dos favoritos.' : 'Adicionado aos favoritos!');
        analytics.trackFavorite(item.categoria, isCurrentlyFavorite ? 'remove' : 'add');
    }, [setFavorites, showToast, favoriteIds]);
    
    const handleSelect = (item: GeneratedItem) => {
        onClose();
        setTimeout(() => {
            const itemCategory = item.categoria;
            const targetTab = TABS_DATA.find(tab => tab.allowedCategories?.includes(itemCategory)) || TABS_DATA.find(t=>t.id === 'forge');
            if (targetTab && currentAppView !== targetTab.id) {
                changeView(targetTab.id as AppView);
            }
            setSelectedItem(item);
        }, 150);
    };

    const handleClear = () => {
        if (isMasterToolsView) {
            if (window.confirm('Tem certeza de que deseja limpar todo o histórico da Ferramenta do Mestre?')) {
                if (!user) return;
                // FIX: Removed the `user` argument. The API endpoint handles user authentication via session cookies.
                clearMasterToolsHistory()
                    .then(() => {
                        setMasterHistory([]);
                        showToast('info', 'Histórico do Mestre limpo.');
                    })
                    .catch(err => showToast('error', 'Falha ao limpar histórico do mestre.'));
            }
        } else {
             if (window.confirm(`Tem certeza de que deseja limpar todo o histórico da Forja?`)) {
                clearHistory();
                showToast('info', `Histórico da Forja foi limpo.`);
            }
        }
    };
    
    const handleExportDocs = async () => {
        if (!user) { showToast('error', 'Você precisa estar logado para exportar.'); return; }
        setIsExporting('docs');
        try {
            const result = await exportDataToGoogleDocs(history, favorites, user);
            showToast('success', 'Documento criado! Abrindo em nova aba...');
            window.open(result.url, '_blank');
        } catch (error: any) {
            showToast('error', `Falha ao criar Google Doc: ${error.message}`);
        } finally {
            setIsExporting(false);
        }
    };

    const currentForgeItems: GeneratedItem[] = useMemo(() => {
        let items: GeneratedItem[] = activeTab === 'history' ? history : favorites;
        if (categoryFilter !== 'all' && CATEGORY_MAP[categoryFilter]) {
            const allowedCategories = new Set(CATEGORY_MAP[categoryFilter]);
            return items.filter(item => allowedCategories.has(item.categoria));
        }
        return items;
    }, [activeTab, history, favorites, categoryFilter]);

    const SubTabButton: React.FC<{ tab: 'history' | 'favorites'; label: string; icon: React.ReactNode; disabled?: boolean; }> = ({ tab, label, icon, disabled }) => (
         <button
            onClick={() => setActiveTab(tab)}
            disabled={disabled}
            className={`relative px-4 py-2 text-sm rounded-md transition-colors ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
             <span className="relative z-10 flex items-center justify-center gap-2">{icon} {label}</span>
            {activeTab === tab && (
                <motion.div
                    layoutId="sub-tab-underline"
                    className="absolute inset-0 bg-white/10 rounded-md"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}
        </button>
    );

    const renderForgeContent = () => (
        currentForgeItems.length > 0 ? (
            <VirtualizedList
                items={currentForgeItems}
                renderItem={(item) => (
                    <TomeListItem 
                        item={item} 
                        onSelect={handleSelect} 
                        onToggleFavorite={handleToggleFavorite}
                        isFavorite={favoriteIds.has(item.id)}
                    />
                )}
                itemHeight={72}
            />
        ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <div className="text-center">
                    {activeTab === 'history' ? <HistoryIcon className="w-12 h-12 mx-auto mb-2 opacity-50"/> : <StarIcon className="w-12 h-12 mx-auto mb-2 opacity-50"/>}
                    <p className="font-semibold text-white">Nenhum item aqui</p>
                    <p className="text-sm">
                        {activeTab === 'history' 
                            ? `Crie algo na Forja para começar.`
                            : 'Clique na estrela para favoritar suas criações.'}
                    </p>
                </div>
            </div>
        )
    );

    const renderMasterToolsContent = () => {
        if (isLoadingMasterHistory) {
            return <div className="h-full flex items-center justify-center"><Spinner /></div>;
        }
        return masterHistory.length > 0 ? (
            <div className="h-full overflow-y-auto inner-scroll space-y-2 pr-2">
                {masterHistory.map(item => <MasterToolListItem key={item.id} item={item} />)}
            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <div className="text-center">
                    <BrainIcon className="w-12 h-12 mx-auto mb-2 opacity-50"/>
                    <p className="font-semibold text-white">Nenhuma análise encontrada</p>
                    <p className="text-sm">Use a Ferramenta do Mestre para criar um histórico.</p>
                </div>
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 tome-backdrop"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 10, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 10, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="bg-gradient-to-b from-gray-900 to-gray-950/95 backdrop-blur-xl border border-gray-700 rounded-lg shadow-2xl w-full md:max-w-4xl h-[95vh] md:h-[85vh] flex flex-col overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <header className="flex-shrink-0 p-4 border-b border-gray-800 flex justify-between items-center bg-black/20">
                            <div className="flex items-center gap-3">
                                <BookIcon className="w-6 h-6 text-indigo-400"/>
                                <h2 className="text-xl font-bold font-gangofthree text-white">Tomo da Biblioteca</h2>
                            </div>
                             <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
                        </header>
                        
                        {/* Sub-Tabs (History/Favorites) & Actions */}
                        <div className="flex-shrink-0 px-3 py-2 flex justify-between items-center border-b border-gray-800 bg-black/20 z-10">
                             <div className="flex items-center gap-4">
                                <div className="flex gap-2 p-1 bg-black/20 rounded-lg">
                                    <SubTabButton tab="history" label="Histórico" icon={<HistoryIcon className="w-5 h-5"/>} />
                                    <SubTabButton tab="favorites" label="Favoritos" icon={<StarIcon className="w-5 h-5"/>} disabled={isMasterToolsView} />
                                </div>
                                {!isMasterToolsView && (
                                    <div className="w-56">
                                        <SearchableSelect
                                            label=""
                                            options={categoryFilterOptions}
                                            value={categoryFilter}
                                            onChange={setCategoryFilter}
                                        />
                                    </div>
                                )}
                             </div>
                             {(activeTab === 'history') && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={handleClear}
                                    disabled={isMasterToolsView ? masterHistory.length === 0 : history.length === 0}
                                >
                                    <TrashIcon className="w-4 h-4"/>
                                    Limpar
                                </Button>
                             )}
                        </div>

                        {/* Content */}
                        <main className="flex-grow p-2 overflow-hidden relative">
                             <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${initialState.view}-${activeTab}-${categoryFilter}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
                                    exit={{ opacity: 0, x: 10, transition: { duration: 0.2, ease: 'easeIn' } }}
                                    className="h-full"
                                >
                                    {isMasterToolsView ? renderMasterToolsContent() : renderForgeContent()}
                                </motion.div>
                            </AnimatePresence>
                        </main>
                        <footer className="p-2 border-t border-gray-800 flex-shrink-0 flex justify-end gap-2">
                            {user && !isMasterToolsView && (
                                <>
                                    <Button variant="secondary" onClick={handleExportDocs} disabled={!!isExporting}>
                                        {isExporting === 'docs' ? <Spinner size="sm"/> : <DownloadIcon className="w-4 h-4" />}
                                        {isExporting === 'docs' ? 'Criando Doc...' : 'Exportar para Google Docs'}
                                    </Button>
                                </>
                            )}
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};