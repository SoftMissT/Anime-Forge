import React, { useState, useCallback, useEffect } from 'react';
// FIX: Add useAlchemy import
import { useAlchemy, useAppCore, useAuth } from '../contexts/AppContext';
// FIX: Add generatePrompts import
import { generatePrompts } from '../lib/client/orchestrationService';
import { AuthOverlay } from './AuthOverlay';
import { Button, TextArea, Switch, Spinner } from './ui';
import { CollapsibleSection } from './ui/CollapsibleSection';
import { MagicWandIcon, SettingsIcon } from './icons';
import { MidjourneyParametersComponent } from './MidjourneyParameters';
import { GptStructuredBuilder } from './GptStructuredBuilder';
import { GeminiParametersComponent } from './GeminiParameters';
import { AlchemyLoadingIndicator } from './AlchemyLoadingIndicator';
import { PromptResultDisplay } from './PromptResultDisplay';
import { analytics } from '../lib/analytics';
// FIX: Add PromptGenerationResult and AlchemyHistoryItem imports
import type { PromptGenerationResult, AlchemyHistoryItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Modal } from './ui/Modal';

export const PromptEngineeringPanel: React.FC = () => {
    const {
        basePrompt, setBasePrompt,
        negativePrompt, setNegativePrompt,
        mjParams, setMjParams,
        gptParams, setGptParams,
        geminiParams, setGeminiParams,
        addHistoryItem, setSelectedItem,
        selectedItem,
    } = useAlchemy();
    
    const { loadingState, setLoadingState, setAppError } = useAppCore();
    const { isAuthenticated, user, handleLoginClick } = useAuth();
    
    const isMobile = useMediaQuery('(max-width: 1024px)');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    
    const [results, setResults] = useState<PromptGenerationResult | null>(null);
    const [generateFor, setGenerateFor] = useState({
        midjourney: true,
        gpt: true,
        gemini: true,
    });

    useEffect(() => {
        if (selectedItem) {
            setBasePrompt(selectedItem.inputs?.basePrompt || '');
            setNegativePrompt(selectedItem.inputs?.negativePrompt || '');
            const defaultGenerateFor = { midjourney: true, gpt: true, gemini: true };
            setGenerateFor({ ...defaultGenerateFor, ...selectedItem.inputs?.generateFor });
            setResults(selectedItem.outputs || null);
        }
    }, [selectedItem, setBasePrompt, setNegativePrompt]);


    const handleGenerateForChange = (model: 'midjourney' | 'gpt' | 'gemini') => {
        setGenerateFor(prev => ({ ...prev, [model]: !prev[model] }));
    };
    const isAnyPlatformSelected = Object.values(generateFor).some(v => v);
    
    const handleGenerate = useCallback(async () => {
        if (!user) {
            setAppError({ message: "Autenticação necessária para gerar." });
            return;
        }

        setLoadingState({ active: true, content: 'alchemy' });
        setResults(null);
        const startTime = Date.now();

        try {
            const resultData = await generatePrompts({
                basePrompt,
                negativePrompt,
                mjParams,
                gptParams,
                geminiParams,
                generateMidjourney: generateFor.midjourney,
                generateGpt: generateFor.gpt,
                generateGemini: generateFor.gemini,
                user, // Pass the user object
            });
            setResults(resultData);
            
            const newHistoryItem: AlchemyHistoryItem = {
                id: uuidv4(),
                createdAt: new Date().toISOString(),
                inputs: { basePrompt, negativePrompt, generateFor },
                outputs: resultData
            };
            addHistoryItem(newHistoryItem);
            setSelectedItem(newHistoryItem);

            analytics.track({ category: 'Generation', action: 'AlchemySuccess', label: basePrompt, value: Date.now() - startTime });

        } catch (error: any) {
            setAppError({ message: `Falha na Alquimia|${error.message}`, canRetry: true, onRetry: handleGenerate });
            analytics.track({ category: 'Generation', action: 'AlchemyFailed', label: error.message, value: Date.now() - startTime });
        } finally {
            setLoadingState({ active: false });
        }
    }, [
        basePrompt, negativePrompt, mjParams, gptParams, geminiParams, generateFor, 
        setLoadingState, setAppError, addHistoryItem, setSelectedItem, user
    ]);
    
    const handlePromptChange = (model: 'midjourney' | 'gpt' | 'gemini', newPrompt: string) => {
        setResults(prev => prev ? ({ ...prev, [`${model}Prompt`]: newPrompt }) : null);
    };

    const handleGenerateAndClose = useCallback(async () => {
        await handleGenerate();
        if (isMobile) {
            setIsFilterModalOpen(false);
        }
    }, [handleGenerate, isMobile]);

    const controlPanelComponent = (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-4 flex flex-col h-full overflow-hidden alchemy-panel">
            <h2 className="text-xl font-bold text-white font-gangofthree mb-4 flex-shrink-0">Parâmetros da Alquimia</h2>
            <div className="flex-grow overflow-y-auto inner-scroll pr-2 space-y-6 min-h-0">
                <CollapsibleSection title="Entradas Principais" defaultOpen forceOpen>
                    <div className="space-y-4">
                        <TextArea
                            label="Ideia Base"
                            placeholder="Ex: um caçador de demônios cego com uma lâmina de obsidiana..."
                            value={basePrompt}
                            onChange={(e) => setBasePrompt(e.target.value)}
                            rows={5}
                            className="alchemy-base-prompt"
                        />
                        <TextArea
                            label="Prompt Negativo (Opcional)"
                            placeholder="Ex: cartoon, blurry, low quality"
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            rows={2}
                        />
                    </div>
                </CollapsibleSection>
                
                 <CollapsibleSection title="Plataformas de Geração" defaultOpen>
                    <div className="grid grid-cols-3 gap-2 p-2 bg-black/20 rounded-lg">
                        <Switch label="Midjourney" checked={generateFor.midjourney} onChange={() => handleGenerateForChange('midjourney')} />
                        <Switch label="DALL-E / GPT" checked={generateFor.gpt} onChange={() => handleGenerateForChange('gpt')} />
                        <Switch label="Gemini" checked={generateFor.gemini} onChange={() => handleGenerateForChange('gemini')} />
                    </div>
                </CollapsibleSection>

                {generateFor.midjourney && (
                    <CollapsibleSection title="Parâmetros do Midjourney" defaultOpen>
                        <MidjourneyParametersComponent params={mjParams} setParams={setMjParams} />
                    </CollapsibleSection>
                )}
                {generateFor.gpt && (
                    <CollapsibleSection title="Estrutura para DALL-E / GPT" defaultOpen>
                        <GptStructuredBuilder params={gptParams} setParams={setGptParams} />
                    </CollapsibleSection>
                )}
                {generateFor.gemini && (
                     <CollapsibleSection title="Estrutura para Gemini" defaultOpen>
                         <GeminiParametersComponent params={geminiParams} setParams={setGeminiParams} />
                     </CollapsibleSection>
                )}
            </div>
            <div className="mt-6 flex-shrink-0">
                 <Button
                    className="w-full btn-alchemy"
                    size="lg"
                    onClick={handleGenerateAndClose}
                    disabled={loadingState.active || !basePrompt || !isAnyPlatformSelected}
                    title={!isAnyPlatformSelected ? "Selecione ao menos uma plataforma para gerar" : ""}
                >
                    {loadingState.active ? (
                        <>
                            <Spinner size="sm" />
                            Destilando...
                        </>
                    ) : (
                        <>
                            <MagicWandIcon className="w-5 h-5" />
                            Destilar Prompts
                        </>
                    )}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="relative w-full h-full flex gap-6 view-container">
            {!isAuthenticated && <AuthOverlay onLoginClick={handleLoginClick} title="Acesso à Alquimia" />}
            
            {isMobile ? (
                 <Modal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    variant="drawer-left"
                    panelClassName="!w-[480px] max-w-[90vw]"
                >
                    {controlPanelComponent}
                </Modal>
            ) : (
                <aside className="w-full max-w-[480px] flex-shrink-0 flex flex-col gap-4">
                    {controlPanelComponent}
                </aside>
            )}

            <main className="flex-1 min-w-0">
                 {isMobile && (
                     <Button
                         onClick={() => setIsFilterModalOpen(true)}
                         className="w-full mb-4 btn-alchemy"
                         size="lg"
                     >
                         <SettingsIcon className="w-5 h-5" />
                         Configurar Alquimia
                     </Button>
                 )}
                {loadingState.active && loadingState.content === 'alchemy' ? (
                    <AlchemyLoadingIndicator />
                ) : results ? (
                    <PromptResultDisplay results={results} onPromptChange={handlePromptChange} />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 bg-[var(--bg-card)]/50 border border-dashed border-[var(--border-color)] rounded-lg">
                        <MagicWandIcon className="w-16 h-16 mb-4" />
                        <h3 className="text-xl font-bold text-white">O Caldeirão Aguarda</h3>
                        <p>Sua ideia será transformada em prompts poderosos aqui.</p>
                    </div>
                )}
            </main>
        </div>
    );
};