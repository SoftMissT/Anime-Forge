import React from 'react';
import { Modal } from './ui/Modal';
import type { GlossaryTerm } from '../lib/glossaryData';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  term: GlossaryTerm | null;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose, term }) => {
  if (!isOpen || !term) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={term.name}>
      <div className="p-6 space-y-4">
        <p className="text-gray-300">{term.definition}</p>
        <p className="text-xs text-gray-500">
          Fonte: Crônicas do Sol, página {term.sourcePage}
        </p>
      </div>
    </Modal>
  );
};
