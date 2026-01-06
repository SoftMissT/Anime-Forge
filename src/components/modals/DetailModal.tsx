import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { GeneratedItem } from '../../types';

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: GeneratedItem | null;
    isFavorite: boolean;
    onToggleFavorite: (item: GeneratedItem) => void;
    onUpdate: (item: GeneratedItem) => void;
    onGenerateVariant: () => void;
    onNavigateNewer: () => void;
    onNavigateOlder: () => void;
    canNavigateNewer: boolean;
    canNavigateOlder: boolean;
}


export const DetailModal: React.FC<DetailModalProps> = ({
    isOpen,
    onClose,
    item,
}) => {
  const getTitle = () => {
    if (!item) return "Detalhes";
    // FIX: Property 'name' does not exist on type 'GeneratedItem'. Use 'nome' instead.
    return item.nome || "Detalhes do Item";
  };

  const getContent = () => {
      if (!item) return null;
      // FIX: Properties 'content' and 'description' do not exist on type 'GeneratedItem'. Use 'descricao'.
      if (item.content) return item.content;
      if (item.descricao) return item.descricao;
      // Fallback for any other structure
      return JSON.stringify(item, null, 2);
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} variant='drawer-left'>
      <div className="space-y-4 text-text-secondary h-full flex flex-col p-4">
        {item ? (
          <div className="flex-grow space-y-4 overflow-y-auto pr-2">
              <h3 className="text-xl font-semibold text-text-primary font-gangofthree bg-accent-gradient bg-clip-text text-transparent">
                  {getTitle()}
              </h3>
              <p className="whitespace-pre-wrap leading-relaxed">
                  {getContent()}
              </p>
          </div>
        ) : (
          <div className="p-4 bg-bg-primary border border-border-color rounded-md flex-grow flex items-center justify-center">
            <p className="text-text-muted italic">Nenhum item selecionado...</p>
          </div>
        )}
        
        <div className="pt-4 flex justify-end mt-auto">
            <Button onClick={onClose} variant="secondary">
                Fechar
            </Button>
        </div>
      </div>
    </Modal>
  );
};