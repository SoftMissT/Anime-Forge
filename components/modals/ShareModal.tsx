// components/modals/ShareModal.tsx
// (Equivalente: components/ShareButton.tsx)
import React, { useState } from 'react';
import { Tooltip } from '../ui/Tooltip';
import { ShareIcon } from '../icons/ShareIcon';
import { useToast } from '../ToastProvider';

export const ShareModal: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const { showToast } = useToast();

    const handleShare = () => {
        navigator.clipboard.writeText('https://demon-slayer-gerador.vercel.app');
        setCopied(true);
        showToast('success', 'Link de compartilhamento copiado!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Tooltip text={copied ? "Link Copiado!" : "Compartilhar App"}>
            <button onClick={handleShare} className="header-icon-btn" aria-label="Compartilhar">
                <ShareIcon className="w-6 h-6" />
            </button>
        </Tooltip>
    );
};

export default ShareModal;
