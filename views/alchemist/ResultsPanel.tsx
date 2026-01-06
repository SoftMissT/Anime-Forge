import React, { useState } from 'react';
// FIX: Import AlchemistItem (now defined in types.ts)
import type { AlchemistItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

interface ResultsPanelProps {
    results: AlchemistItem[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
    onToggleFavorite: (item: AlchemistItem) => void;
}

const AlchemistIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v10.5c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75V6.25a.75.75 0 0 0-.75-.75H4.25ZM8.01 10.01a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H8.76a.75.75 0 0 1-.75-.75v-1.5Zm-1.48 4.75a.75.75 0 0 1 .75-.75h7.44a.75.75 0 0 1 0 1.5H7.28a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" /></svg>
);
const ErrorIcon = ({ className = '' }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

const EmptyState: React.FC = () => (
    <div className="text-center text-text-muted">
        <AlchemistIcon className="mx-auto h-16 w-16 text-accent-start/50" />
        <h3 className="mt-4 text-xl font-semibold text-text-primary">Laboratório de Prompt</h3>
        <p className="mt-2 text-sm max-w-sm mx-auto">
            Use as ferramentas do alquimista para experimentar com diferentes modelos e parâmetros. A resposta bruta da IA aparecerá aqui.
        </p>
    </div>
);

const LoadingState: React.FC = () => (
    <div className="text-center text-text-muted">
        <Spinner size="lg"/>
        <p className="mt-4 text-sm animate-pulse">Consultando o oráculo...</p>
    </div>
);

const ErrorState: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
    <div className="text-center text-red-400">
        <ErrorIcon className="mx-auto h-12 w-12" />
        <h3 className="mt-4 text-xl font-semibold text-text-primary">Falha na Transmutação</h3>
        <p className="mt-2 text-sm">{error}</p>
        <Button onClick={onRetry} variant="secondary" className="mt-6">
            Tentar Novamente
        </Button>
    </div>
);

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, isLoading, error, onRetry, onToggleFavorite }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (item: AlchemistItem) => {
        navigator.clipboard.writeText(item.response);
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2000);
    };
    
    const renderContent = () => {
        if (isLoading) return <LoadingState />;
        if (error) return <ErrorState error={error} onRetry={onRetry} />;
        if (results.length === 0) return <EmptyState />;

        const latestResult = results[0];

        return (
            <div className="w-full h-full flex flex-col p-4 bg-bg-card border border-border-color rounded-lg">
                <div className="flex-shrink-0 flex items-center justify-between mb-2">
                    <h3 className="font-mono text-sm text-text-secondary">Resposta da IA</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(latestResult)}
                    >
                        {copiedId === latestResult.id ? 'Copiado!' : 'Copiar'}
                    </Button>
                </div>
                <pre className="flex-grow w-full text-sm text-text-primary bg-bg-primary p-4 rounded-md overflow-auto font-mono whitespace-pre-wrap">
                    <code>
                        {latestResult.response}
                    </code>
                </pre>
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