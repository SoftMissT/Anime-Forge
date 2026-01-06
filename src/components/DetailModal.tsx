import React from 'react';
import { Modal } from './ui/Modal';
import { DetailPanel } from './DetailPanel';
import type { GeneratedItem } from '../types';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GeneratedItem | null;
  onGenerateVariant: (item: GeneratedItem, variantType: 'agressiva' | 'técnica' | 'defensiva') => void;
  isFavorite: boolean;
  onToggleFavorite: (item: GeneratedItem) => void;
  onUpdate: (item: GeneratedItem) => void;
  onNavigateNewer: () => void;
  onNavigateOlder: () => void;
  canNavigateNewer: boolean;
  canNavigateOlder: boolean;
}

const DetailModalComponent: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  item,
  ...props
}) => {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" panelClassName="w-full !p-0 detail-modal-panel h-[95vh] md:h-[90vh] md:max-h-[900px] md:max-w-4xl">
        <DetailPanel item={item} {...props} />
    </Modal>
  );
};

export const DetailModal = React.memo(DetailModalComponent);
DetailModal.displayName = 'DetailModal';