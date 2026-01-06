
import React, { useMemo, memo } from 'react';

const AlquimiaBackgroundComponent = () => {
    const bubbles = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => {
            const size = `${10 + Math.random() * 40}px`;
            const style: React.CSSProperties = {
                left: `${Math.random() * 100}%`,
                width: size,
                height: size,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
            };
            return <div key={i} className="bubble" style={style}></div>;
        });
    }, []);
    return <div className="bubble-container">{bubbles}</div>;
};

export const AlquimiaBackground = memo(AlquimiaBackgroundComponent);
AlquimiaBackground.displayName = 'AlquimiaBackground';
