

import React from 'react';
import { Modal } from './ui/Modal';
import { AboutPanel } from './AboutPanel';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      panelClassName="!bg-transparent !border-0 !p-0 w-full max-w-3xl"
    >
        <AboutPanel onClose={onClose} />
    </Modal>
  );
};