import React, { useEffect, useState } from 'react';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';
import { CollapsibleSection } from './CollapsibleSection';
import { Button } from './Button';
import type { AppError } from '../../types';
import { Modal } from './Modal';

interface ErrorDisplayProps {
  error: AppError | string | null;
  onDismiss: () => void;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
    const [errorObject, setErrorObject] = useState<AppError | null>(null);

    useEffect(() => {
        if (!error) {
            setErrorObject(null);
            return;
        }

        // Normalize input into a full AppError object
        const baseError: AppError = typeof error === 'string'
            ? { message: 'Erro Inesperado|' + error }
            : error;
            
        const finalError: AppError = { type: 'error', ...baseError }; // Default to 'error'

        // Parse title and details from message if a pipe exists and details aren't already set
        const parts = finalError.message.split('|');
        if (parts.length > 1 && !finalError.details) {
            finalError.message = parts[0];
            finalError.details = parts[1];
        }
        
        setErrorObject(finalError);

    }, [error]);

    if (!errorObject) {
        return null;
    }

    const isWarning = errorObject.type === 'warning';
    const title = errorObject.message || (isWarning ? 'Aviso' : 'Erro Inesperado');
    const borderColor = isWarning ? 'border-amber-500' : 'border-red-500';
    const iconColor = isWarning ? 'text-amber-500' : 'text-red-500';
    const primaryButtonClass = isWarning ? 'btn-alchemy' : 'btn-forge'; // Differentiate visually

    const handleRetry = () => {
        onDismiss();
        if(errorObject.onRetry) errorObject.onRetry();
    };

    const renderDetails = () => {
        if (!errorObject.details || (Array.isArray(errorObject.details) && errorObject.details.length === 0)) {
            return <p>Por favor, tente novamente. Se o problema persistir, ajuste seus filtros ou recarregue a página.</p>;
        }
        if (Array.isArray(errorObject.details)) {
            return (
                <ul className="list-disc list-inside space-y-1">
                    {errorObject.details.map((detail, index) => <li key={index}>{detail}</li>)}
                </ul>
            );
        }
        // It's a string
        const detailString = String(errorObject.details);
        if (detailString.length > 200) {
             return (
                <>
                    <p className="mb-2">Ocorreu uma falha. Verifique os detalhes técnicos ou tente novamente.</p>
                    <CollapsibleSection title="Detalhes Técnicos">
                        <div className="mt-2 p-3 bg-black/30 rounded text-xs font-mono break-all max-h-40 overflow-y-auto inner-scroll text-red-300">
                            {detailString}
                        </div>
                    </CollapsibleSection>
                </>
             );
        }
        return <p>{detailString}</p>;
    };

    return (
        <Modal 
            isOpen={!!errorObject} 
            onClose={onDismiss} 
            title={title}
            panelClassName={`max-w-lg border-t-4 ${borderColor}`}
        >
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <AlertTriangleIcon className={`w-10 h-10 flex-shrink-0 ${iconColor} mt-1`} />
                    <div className="flex-grow text-gray-300">
                       {renderDetails()}
                    </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onDismiss}>
                        Fechar
                    </Button>
                    {errorObject.canRetry && errorObject.onRetry && (
                        <Button onClick={handleRetry} className={primaryButtonClass}>
                            Tentar Novamente
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};