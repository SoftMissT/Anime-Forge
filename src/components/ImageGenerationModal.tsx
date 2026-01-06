import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button, Spinner, TextArea } from './ui';
import { generateAndAssignImage } from '../lib/client/orchestrationService';
import { useAuth } from '../contexts/AppContext';
import { useToast } from './ToastProvider';
import type { GeneratedItem } from '../types';
import { SparklesIcon } from './icons';

interface ImageGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GeneratedItem | null;
  onUpdate: (updatedItem: GeneratedItem) => void;
}

export const ImageGenerationModal: React.FC<ImageGenerationModalProps> = ({ isOpen, onClose, item, onUpdate }) => {
  const [prompt, setPrompt] = useState(item?.imagePromptDescription || '');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  React.useEffect(() => {
    if (item) {
      setPrompt(item.imagePromptDescription || '');
    }
  }, [item]);

  const handleGenerate = async () => {
    if (!item || !user || !prompt) return;

    setIsLoading(true);
    try {
      // FIX: Removed the `user` property. The API endpoint handles user authentication via session cookies.
      const { updatedItem } = await generateAndAssignImage({
        prompt,
        creationId: item.id,
        category: item.categoria,
      });
      onUpdate(updatedItem);
      showToast('success', 'Imagem gerada e associada com sucesso!');
      onClose();
    } catch (error: any) {
      showToast('error', `Falha ao gerar imagem: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerar Imagem a partir de Prompt" panelClassName="w-full max-w-lg">
      <div className="p-6 space-y-4">
        <TextArea
          label="Prompt para Geração"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="font-mono text-sm"
        />
        <Button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="w-full btn-alchemy"
          size="lg"
        >
          {isLoading ? <Spinner size="sm" /> : <SparklesIcon className="w-5 h-5" />}
          {isLoading ? 'Gerando e Vinculando...' : 'Gerar Imagem'}
        </Button>
      </div>
    </Modal>
  );
};