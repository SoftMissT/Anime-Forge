import React, { useState } from 'react';
// FIX: Import MasterToolItem (now defined in types.ts)
import type { MasterToolItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

interface ResultsPanelProps {
    results: MasterToolItem[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
    onToggleFavorite: (item: MasterToolItem) => void;
}

const MasterToolsIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a1 1 0 0 1 1 1v7.5a1.5 1.5 0 0 1-3 0V3a1 1 0 0 1 1-1Zm0 11.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM13 15a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z M3 15.5a1 1 0 0 1 1-1h1.5a1.5 1.5 0 0 1 0 3H4a1 1 0 0 1-1-1Zm13.5 1.5a1.5 1.5 0 0 1 0-3H19a1 1 0 1 1 0 2h-2.5Z"/></svg>
);
const HeartIcon = ({ className = '', isFavorite = false }: { className?: string, isFavorite?: boolean }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);
const ErrorIcon = ({ className = '' }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

const EmptyState: React.FC = () => (
    <div className="text-center text-text-muted">
        <MasterToolsIcon className="mx-auto h-16 w-16 text-accent-start/50" />
        <h3 className="mt-4 text-xl font-semibold text-text-primary">Oficina do Mestre</h3>
        <p className="mt-2 text-sm max-w-sm mx-auto">
            Selecione uma ferramenta, ajuste as opções e clique em 'Usar Ferramenta' para gerar utilitários criativos para sua história.
        </p>
    </div>
);

const LoadingState: React.FC = () => (
    <div className="text-center text-text-muted">
        <Spinner size="lg"/>
        <p className="mt-4 text-sm animate-pulse">Consultando os pergaminhos...</p>
    </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
    <div className="text-center text-red-400">
        <ErrorIcon className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-xl font-semibold text-text-primary">Erro na Ferramenta</h3>
        <p className="mt-2 text-sm">{error}</p>
        <Button onClick={onRetry} variant="secondary" className="mt-6">
            Tentar Novamente
        </Button>
    </div>
);

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, isLoading, error, onRetry, onToggleFavorite }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (item: MasterToolItem) => {
        navigator.clipboard.writeText(item.content);
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const renderContent = () => {
        if (isLoading) return <LoadingState />;
        if (error) return <ErrorState error={error} onRetry={onRetry} />;
        if (results.length === 0) return <EmptyState />;

        return (
            <div className="w-full max-w-2xl">
                <ul className="space-y-3">
                    {results.map(item => (
                        <li 
                            key={item.id} 
                            className="bg-bg-card border border-border-color rounded-md p-3 flex items-center justify-between gap-3 transition-colors duration-200 hover:bg-bg-secondary"
                        >
                            <span className="text-text-primary flex-grow">{item.content}</span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleCopy(item)}
                                    className="w-20"
                                >
                                    {copiedId === item.id ? 'Copiado!' : 'Copiar'}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => onToggleFavorite(item)} 
                                    title={item.isFavorite ? 'Desfavoritar' : 'Favoritar'}
                                >
                                   <HeartIcon className={`w-5 h-5 ${item.isFavorite ? 'text-red-500' : 'text-text-muted'}`} isFavorite={item.isFavorite}/>
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
    
    return (
        <section className="flex-grow w-full md:w-2/3 lg:w-3/4 h-full flex flex-col">
            <div className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto flex items-center justify-center">
               {renderContent()}
            </div>
        </section>
    );
};