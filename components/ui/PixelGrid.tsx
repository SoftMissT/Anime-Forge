import React, { useState, useEffect } from 'react';
// FIX: Imported Variants to strongly type animation variants.
import { motion, Variants } from 'framer-motion';

export const PixelGrid: React.FC = () => {
    const [grid, setGrid] = useState({ cols: 0, rows: 0, total: 0 });

    useEffect(() => {
        const calculateGrid = () => {
            const size = 40; // Size of each square in pixels
            const cols = Math.ceil(window.innerWidth / size);
            const rows = Math.ceil(window.innerHeight / size);
            setGrid({ cols, rows, total: cols * rows });
        };
        calculateGrid();
        window.addEventListener('resize', calculateGrid);
        return () => window.removeEventListener('resize', calculateGrid);
    }, []);

    const gridVariants = {
        visible: { transition: { staggerChildren: 0.005 } },
        hidden: { transition: { staggerChildren: 0.005, staggerDirection: -1 } }
    };

    // FIX: Explicitly typed 'pixelVariants' with 'Variants' from framer-motion to resolve a type incompatibility error with the transition 'type' property.
    const pixelVariants: Variants = {
        visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
        hidden: { scale: 0, opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
    };

    if (grid.total === 0) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 grid"
            // FIX: Cast style object to React.CSSProperties to resolve an issue where 'gridTemplateColumns' was not recognized as a valid property in 'MotionStyle'.
            style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` } as React.CSSProperties}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={gridVariants}
        >
            {Array.from({ length: grid.total }).map((_, i) => (
                <motion.div
                    key={i}
                    className="bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]"
                    variants={pixelVariants}
                />
            ))}
        </motion.div>
    );
};
