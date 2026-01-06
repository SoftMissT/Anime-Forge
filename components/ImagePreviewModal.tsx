import React from 'react';
import { Modal } from './ui/Modal';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: string | null;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ isOpen, onClose, imageData }) => {
  if (!imageData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="center" panelClassName="!bg-transparent border-0 !p-0 max-w-4xl w-full">
      <div className="relative">
        <img
          src={`data:image/jpeg;base64,${imageData}`}
          alt="Pré-visualização da imagem gerada"
          className="rounded-lg max-w-full max-h-[85vh] object-contain"
        />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-gray-900/80 rounded-full p-1 text-white hover:text-gray-300"
          aria-label="Fechar pré-visualização"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Modal>
  );
};