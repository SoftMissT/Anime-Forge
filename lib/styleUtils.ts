// FIX: Added missing React import to resolve "Cannot find namespace 'React'" error for CSSProperties type.
import React from 'react';

export const getRarityStyles = (rarity: string | undefined): React.CSSProperties => {
    switch (rarity?.toLowerCase()) {
        case 'comum': return { color: '#9CA3AF', backgroundColor: 'rgba(107, 114, 128, 0.2)' }; // gray-400
        case 'incomum': return { color: '#4ADE80', backgroundColor: 'rgba(74, 222, 128, 0.2)' }; // green-400
        case 'rara': return { color: '#60A5FA', backgroundColor: 'rgba(96, 165, 250, 0.2)' }; // blue-400
        case 'épica': return { color: '#C084FC', backgroundColor: 'rgba(192, 132, 252, 0.2)' }; // purple-400
        case 'lendária': return { color: '#FBBF24', backgroundColor: 'rgba(251, 191, 36, 0.2)' }; // amber-400
        default: return { color: '#9CA3AF', backgroundColor: 'rgba(107, 114, 128, 0.2)' };
    }
};
