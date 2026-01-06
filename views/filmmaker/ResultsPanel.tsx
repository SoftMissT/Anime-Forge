import React from 'react';
// FIX: Import FilmmakerItem (now defined in types.ts)
import type { FilmmakerItem } from '../../types';
// FIX: Card sub-components are now exported from Card.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

interface ResultsPanelProps {
    results: FilmmakerItem[];
    isLoading: boolean;
    loadingMessage: string;
    error: string | null;
    onRetry: () => void;
    onToggleFavorite: (item: FilmmakerItem) => void;
}

const FilmmakerIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm1 5.758L6.445 4.5l1.01.29-1.444 5.258H5Zm3.01 0L9.455 4.5l1.01.29-1.444 5.258H8.01Zm3.01 0L12.465 4.5l1.01.29-1.444 5.258h-1.01Zm3.01 0L15.475 4.5l1.01.29-1.444 5.258h-1.01ZM4 11h16v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7Z"/></svg>
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
        <FilmmakerIcon className="mx-auto h-16 w-16 text-accent-start/50" />
        <h3 className="mt-4 text-xl font-semibold text-text-primary">Luz, Câmera, Ação!</h3>
        <p className="mt-2 text-sm max-w-sm mx-auto">
            Escreva o prompt da sua cena, defina as configurações e clique em 'Gerar Roteiro' para dar vida à sua história.
        </p>
    </div>
);

const LoadingState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center text-text-muted">
        <Spinner size="lg"/>
        <p className="mt-4 text-sm animate-pulse">{message}</p>
    </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
    <div className="text-center text-red-400">
        <ErrorIcon className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-xl font-semibold text-text-primary">Falha na Produção</h3>
        <p className="mt-2 text-sm">{error}</p>
        <Button onClick={onRetry} variant="secondary" className="mt-6">
            Tentar Novamente
        </Button>
    </div>
);

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, isLoading, loadingMessage, error, onRetry, onToggleFavorite }) => {
    
    const renderContent = () => {
        if (isLoading) return <LoadingState message={loadingMessage} />;
        if (error) return <ErrorState error={error} onRetry={onRetry} />;
        if (results.length === 0) return <EmptyState />;

        return (
            <div className="grid grid-cols-fluid-card gap-4">
                {results.map(item => (
                    <Card key={item.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="line-clamp-2" title={item.prompt}>{item.prompt}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-text-secondary line-clamp-6">
                                {item.description}
                            </p>
                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(item)} title={item.isFavorite ? 'Desfavoritar' : 'Favoritar'}>
                               <HeartIcon className={`w-5 h-5 ${item.isFavorite ? 'text-red-500' : 'text-text-muted'}`} isFavorite={item.isFavorite}/>
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