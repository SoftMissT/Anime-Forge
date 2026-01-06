import React from 'react';
// FIX: Import ForgeItem (now defined in types.ts)
import type { ForgeItem } from '../../types';
// FIX: Card sub-components are now exported from Card.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { GeneratedItem } from '../../types';

interface ResultsPanelProps {
    results: GeneratedItem[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
    onViewDetails: (item: GeneratedItem) => void;
    onToggleFavorite: (item: GeneratedItem) => void;
}

const ForgeIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22.783 13.439 12.23 2.885a1.51 1.51 0 0 0-2.094.368l-1.02 1.631a.5.5 0 0 1-.762.15l-1.5-1.071a1 1 0 0 0-1.214.085L2.36 8.33a1 1 0 0 0 .085 1.214l1.07 1.5a.5.5 0 0 1-.15.762l-1.63 1.02a1.51 1.51 0 0 0-.369 2.094l10.553 10.553a1.51 1.51 0 0 0 2.094-.368l1.02-1.631a.5.5 0 0 1 .762-.15l1.5 1.071a1 1 0 0 0 1.214-.085l3.28-4.28a1 1 0 0 0-.085-1.214l-1.07-1.5a.5.5 0 0 1 .15-.762l1.63-1.02a1.51 1.51 0 0 0 .368-2.094ZM9.41 11.59l-1.41-1.41 3-3L15 11.17l-3 3-1.18-1.17-1.41 1.41 2.59 2.59L18 14.17l-3-3 1.59-1.59L15.17 11l-3 3-1.35-1.34-1.41 1.41L12 16.67l3-3 1.17 1.17 1.41-1.41L15 10.83l3 3 1.41-1.41-3-3L12.41 13 11 11.59l-1.59 1.59L8 11.77l1.41-1.41Z"/></svg>
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
        <ForgeIcon className="mx-auto h-16 w-16 text-accent-start/50" />
        <h3 className="mt-4 text-xl font-semibold text-text-primary">Sua Próxima Grande Ideia Começa Aqui</h3>
        <p className="mt-2 text-sm max-w-sm mx-auto">
            Ajuste os parâmetros na forja, descreva sua visão e clique em 'Forjar Ideia' para que a IA crie algo único para você.
        </p>
    </div>
);

const LoadingState: React.FC = () => (
    <div className="text-center text-text-muted">
        <Spinner size="lg"/>
        <p className="mt-4 text-sm animate-pulse">Forjando sua ideia...</p>
    </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
    <div className="text-center text-red-400">
        <ErrorIcon className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-xl font-semibold text-text-primary">Erro na Forja</h3>
        <p className="mt-2 text-sm">{error}</p>
        <Button onClick={onRetry} variant="secondary" className="mt-6">
            Tentar Novamente
        </Button>
    </div>
);

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, isLoading, error, onRetry, onViewDetails, onToggleFavorite }) => {
    
    const renderContent = () => {
        if (isLoading) return <LoadingState />;
        if (error) return <ErrorState error={error} onRetry={onRetry} />;
        if (results.length === 0) return <EmptyState />;

        return (
            <div className="grid grid-cols-fluid-card gap-4">
                {results.map(item => (
                    <Card key={item.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="truncate">{item.nome}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-text-secondary line-clamp-4">
                                {item.descricao}
                            </p>
                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button variant="secondary" className="w-full" onClick={() => onViewDetails(item)}>Ver Detalhes</Button>
                            <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(item)} title={item.is_favorite ? 'Desfavoritar' : 'Favoritar'}>
                               <HeartIcon className={`w-5 h-5 ${item.is_favorite ? 'text-red-500' : 'text-text-muted'}`} isFavorite={item.is_favorite}/>
                            </Button>
                        </CardFooter>
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