
import React from 'react';
import { Modal } from '../ui/Modal';
// FIX: Changed useCoreUI to useAppCore, although it's removed since props are used now.
import { useAppCore } from '../../contexts/AppContext';
import { Button } from '../ui/Button';

// FIX: Added props interface to accept state from parent
interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sobre o Kimetsu Forge">
      <div className="space-y-4 text-text-secondary">
        <p>
            O Kimetsu Forge é uma aplicação poderosa e criativa, projetada para explorar e expandir o universo de Kimetsu no Yaiba (Demon Slayer). 
            Utilizando a IA generativa do Google Gemini, esta ferramenta permite que fãs, criadores de conteúdo e escritores gerem, personalizem e gerenciem uma vasta gama de elementos narrativos.
        </p>
        <p>
            Da criação de personagens e técnicas de respiração únicas à geração de conflitos épicos e locais detalhados, o Forge é o seu ferreiro digital para moldar novas histórias.
        </p>
        <div className="pt-4 flex justify-end">
            <Button onClick={onClose} variant="secondary">
                Fechar
            </Button>
        </div>
      </div>
    </Modal>
  );
};