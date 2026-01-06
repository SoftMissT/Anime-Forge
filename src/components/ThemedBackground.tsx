import React, { memo } from 'react';

const Sparks: React.FC = () => (
    <div className="sparks-container" aria-hidden="true">
        {Array.from({ length: 25 }).map((_, i) => <div key={i} className="spark" style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 5 + 3}s`,
        }}></div>)}
    </div>
);

const AlchemyBubbles: React.FC = () => (
    <div className="bubbles-container" aria-hidden="true">
        {Array.from({ length: 15 }).map((_, i) => <div key={i} className="bubble" style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 30 + 10}px`,
            height: `${Math.random() * 30 + 10}px`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 10 + 5}s`,
        }}></div>)}
    </div>
);

const ThemedBackgroundComponent: React.FC<{ view: 'forge' | 'alchemist' }> = ({ view }) => (
    <div className="app-background">
        {view === 'forge' ? <Sparks /> : <AlchemyBubbles />}
    </div>
);

export const ThemedBackground = memo(ThemedBackgroundComponent);