import React from 'react';
// FIX: Import CosmakerItem (now defined in types.ts)
import type { CosmakerItem } from '../../types';
// FIX: CardContent is now exported from Card.tsx
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

interface ResultsPanelProps {
    results: CosmakerItem[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
    onToggleFavorite: (item: CosmakerItem) => void;
}

const CosmakerIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9.429 2.147a.75.75 0 0 1 .917.223l2.25 3.75a.75.75 0 0 1-.642 1.13H4.752a.75.75 0 0 1-.308-1.411l2.235-1.49a3.75 3.75 0 0 1 2.75-.202ZM14.57 2.147a.75.75 0 0 0-.917.223l-2.25 3.75a.75.75 0 0 0 .642 1.13h7.293a.75.75 0 0 0 .308-1.411l-2.235-1.49a3.75 3.75 0 0 0-2.834-.202ZM8.63 8.25l-5.82 3.88a.75.75 0 0 0-.308 1.411h19.001a.75.75 0 0 0 .308-1.41l-5.82-3.881a3.75 3.75 0 0 0-7.362 0ZM5 15.75a.75.75 0 0 0 .75.75h12.5a.75.75 0 0 0 0-1.5H5.75a.75.75 0 0 0-.75.75Zm.75 3a.75.75 0 0 1 0 1.5h12.5a.75.75 0 0 1 0-1.5H5.75Z"/></svg>
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
const DownloadIcon = ({ className = '' }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
);

const EmptyState: React.FC = () => (
    <div className="text-center text-text-muted">
        <CosmakerIcon className="mx-auto h-16 w-16 text-accent-start/50" />
        <h3 className="mt-4 text-xl font-semibold text-text-primary">Dê Vida à sua Visão</h3>
        <p className="mt-2 text-sm max-w-sm mx-auto">
            Descreva a aparência de um personagem, escolha um estilo e clique em 'Gerar Imagem' para criar um conceito visual.
        </p>
    </div>
);

const LoadingState: React.FC = () => (
    <div className="text-center text-text-muted">
        <Spinner size="lg"/>
        <p className="mt-4 text-sm animate-pulse">Pintando com a respiração...</p>
    </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
    <div className="text-center text-red-400">
        <ErrorIcon className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-xl font-semibold text-text-primary">Falha na Geração</h3>
        <p className="mt-2 text-sm">{error}</p>
        <Button onClick={onRetry} variant="secondary" className="mt-6">
            Tentar Novamente
        </Button>
    </div>
);

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, isLoading, error, onRetry, onToggleFavorite }) => {
    
    const renderContent = () => {
        if (isLoading) return <LoadingState />;
        if (error) return <ErrorState error={error} onRetry={onRetry} />;
        if (results.length === 0) return <EmptyState />;

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map(item => (
                    <Card key={item.id} className="flex flex-col">
                        <div className="relative group aspect-square">
                            <img src={item.imageUrl} alt="Generated character concept" className="absolute inset-0 w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                                    <a href={item.imageUrl} download={`kimetsu-forge-${item.id}.png`} title="Baixar Imagem">
                                        <Button variant="secondary" size="icon" className="!w-9 !h-9">
                                            <DownloadIcon className="w-5 h-5" />
                                        </Button>
                                    </a>
                                    <Button variant="secondary" size="icon" className="!w-9 !h-9" onClick={() => onToggleFavorite(item)} title={item.isFavorite ? 'Desfavoritar' : 'Favoritar'}>
                                       <HeartIcon className={`w-5 h-5 ${item.isFavorite ? 'text-red-500' : 'text-text-muted'}`} isFavorite={item.isFavorite}/>
                                    </Button>
                               </div>
                            </div>
                        </div>
                        <CardContent className="p-3 flex-grow">
                            <p className="text-xs text-text-secondary line-clamp-3" title={item.prompt}>
                                {item.prompt}
                            </p>
                        </CardContent>
                    </Card>
                ))}
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