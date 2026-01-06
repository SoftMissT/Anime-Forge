import React from 'react';

export const Bubbles: React.FC<{ count?: number }> = ({ count = 20 }) => {
    return (
        <div className="bubbles" aria-hidden="true">
            {Array.from({ length: count }).map((_, i) => {
                const style = {
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 30 + 10}px`,
                    height: `${Math.random() * 30 + 10}px`,
                    animationDelay: `${Math.random() * 10}s`,
                    animationDuration: `${Math.random() * 10 + 5}s`,
                };
                return <div key={i} className="bubble" style={style}></div>;
            })}
        </div>
    );
};
