import React from 'react';
import { motion } from 'framer-motion';
import { PixelGrid } from './ui/PixelGrid';

export const ViewTransition: React.FC<{ type: 'burn' | 'magic' }> = ({ type }) => {
    // For now, only using the 'magic' (pixel) transition as it's more versatile.
    if (type === 'magic') {
        return <PixelGrid />;
    }

    // Fallback or alternative 'burn' transition
    return (
        <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{
                maskImage: 'radial-gradient(circle, transparent 0%, black 0%)'
            }}
            animate={{
                maskImage: 'radial-gradient(circle, transparent 100%, black 100%)',
                transition: { duration: 0.6, ease: 'circOut' }
            }}
            exit={{
                maskImage: 'radial-gradient(circle, transparent 0%, black 0%)',
                transition: { duration: 0.6, ease: 'circIn' }
            }}
        />
    );
};