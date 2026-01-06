// components/ClanWarsInterface.tsx
import React, { useState, useCallback } from 'react';
import { useAppCore, useAuth } from '../contexts/AppContext';
import { orchestrateGeneration } from '../lib/client/orchestrationService';
import type { FilterState, ClanWarsResult, GeneratedItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { AuthOverlay } from './AuthOverlay';
import { analytics } from '../lib/analytics';
import { ClanWarsPanel } from './ClanWarsPanel';
import { ClanWarsResultDisplay } from './ClanWarsResultDisplay';
import { SwordsIcon } from './icons';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { TextArea } from './ui';

const initialFilters: Omit<FilterState, 'category' | 'rarity' | 'level' | 'quantity' | 'thematics' | 'tonalidade' | 'country'> = {
  promptModifier: '',
  attackingClan: 'Esquadrão de Caçadores de Demônios',
  defendingClan: 'Os Doze Kizuki (Luas Demoníacas)',
  armySize: 100,
  battleTerrain: 'Floresta Densa',
  battleStrategy: 'Ataque Frontal',
  clanWarsScenario: '',
  turnType: 'Turno por Turno',
  simulationSpeed: 1,
};

export const ClanWarsInterface: React.FC = () => {
    const [filters, setFilters] = useState(initialFilters);
    const [result, setResult] = useState<ClanWarsResult | null>(null);
    const { loadingState, setLoadingState, setAppError } = useAppCore();
    const { isAuthenticated, handleLoginClick, user } = useAuth();
    
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const handleFilterChange = useCallback((field: keyof typeof initialFilters, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleGenerate = useCallback(async () => {
        if (!user) {
            setAppError({ message: "Autenticação necessária para simular."});
            return;
        }

        if (!filters.attackingClan || !filters.defendingClan || filters.attackingClan === filters.defendingClan) {
            setAppError({ message: "Seleção de Clãs Inválida|Por favor, selecione dois clãs diferentes para a batalha."});
            return;
        }

        setLoadingState({ active: true, content: 'clan_wars' });
        const startTime = Date.now();
        
        const apiFilters: FilterState = {
            ...filters,
            category: 'Guerra de Clãs',
            rarity: 'Aleatória',
            level: 10,
            quantity: 1,
            thematics: [],
            tonalidade: 'Aleatória',
            country: 'Aleatório'
        };

        try {
            const rawResult = await orchestrateGeneration(apiFilters, filters.promptModifier);
            const battleResult: ClanWarsResult = {
                id: uuidv4(),
                createdAt: new Date().toISOString(),
                ...rawResult as unknown as Omit<ClanWarsResult, 'id'|'createdAt'>
            };
            
            const generatedItemResult = rawResult as GeneratedItem;
            if (generatedItemResult._validation?.warnings?.length) {
                 setAppError({
                    type: 'warning',
                    message: "Simulação Concluída com Avisos",
                    details: generatedItemResult._validation.warnings,
                });
            }

            setResult(battleResult);
            analytics.trackGeneration('Guerra de Clãs', true, Date.now() - startTime);
        } catch (error: any) {
            console.error("Clan War generation failed:", error);
            setAppError({ message: `Falha na Simulação|${error.message}`, canRetry: true, onRetry: handleGenerate });
            analytics.trackGeneration('Guerra de Clãs', false, Date.now() - startTime);
        } finally {
            setLoadingState({ active: false });
        }
    }, [filters, setLoadingState, setAppError, user]);

    const handleGenerateAndClose = useCallback(async () => {
        await handleGenerate();
        if (isMobile) {
            setIsFilterModalOpen(false);
        }
    }, [handleGenerate, isMobile]);

    const clanWarsPanelComponent = (
        <ClanWarsPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onGenerate={handleGenerateAndClose}
            isLoading={loadingState.active && loadingState.content === 'clan_wars'}
        />
    );


    return (
        <div className="relative w-full h-full flex gap-6 p-4">
            {!isAuthenticated && <AuthOverlay onLoginClick={handleLoginClick} title="Acesso ao Teatro de Guerra" />}

             {isMobile ? (
                 <Modal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    variant="drawer-left"
                    panelClassName="!w-[420px] max-w-[90vw]"
                >
                    {clanWarsPanelComponent}
                </Modal>
            ) : (
                <aside className="w-full max-w-md flex-shrink-0 flex flex-col">
                    {clanWarsPanelComponent}
                </aside>
            )}
            
            <main className="flex-1 min-w-0 flex flex-col gap-4">
                {isMobile && (
                     <Button
                         onClick={() => setIsFilterModalOpen(true)}
                         className="w-full mb-4 btn-clan_wars flex-shrink-0"
                         size="lg"
                     >
                         <SwordsIcon className="w-5 h-5" />
                         Configurar Batalha
                     </Button>
                 )}
                
                <TextArea
                    placeholder="Instruções Específicas (Opcional): Ex: 'um dos generais é um traidor', 'a batalha acontece durante uma nevasca'..."
                    value={filters.promptModifier}
                    onChange={(e) => handleFilterChange('promptModifier', e.target.value)}
                    rows={2}
                    className="flex-shrink-0"
                />

                <div className="flex-grow min-h-0">
                    {loadingState.active && loadingState.content === 'clan_wars' ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 bg-[var(--bg-card)]/50 border border-dashed border-[var(--border-color)] rounded-lg p-8">
                            <SwordsIcon className="w-16 h-16 mb-4 animate-pulse"/>
                            <h3 className="text-xl font-bold text-white">Simulando Batalha...</h3>
                            <p>Os ventos da guerra sopram...</p>
                        </div>
                    ) : (
                        <ClanWarsResultDisplay result={result} />
                    )}
                </div>
            </main>
        </div>
    );
};