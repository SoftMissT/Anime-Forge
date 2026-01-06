
import React from 'react';

export const createParticles = (count: number, className: string, content?: string[]) => {
    return Array.from({ length: count }).map((_, i) => {
        // FIX: Changed 'const' to 'let' to allow modification of the style object.
        let style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
        };

        if (className === 'ember') {
            style.width = `${2 + Math.random() * 4}px`;
            style.height = style.width;
            (style as any)['--wind-direction'] = String(Math.random() - 0.5);
        } else if (className === 'spark') {
            style.animationDuration = `${1 + Math.random() * 2}s`;
            style.left = `${40 + Math.random() * 20}%`;
        } else if (className === 'rune') {
             style.fontSize = `${14 + Math.random() * 16}px`;
        } else if (className === 'leaf') {
             style.width = `${10 + Math.random() * 10}px`;
             style.height = style.width;
        } else if (className === 'lightning-bolt') {
             style.animationDelay = `${Math.random() * 6}s`;
             style.animationDuration = `${Math.random() * 0.1 + 0.05}s`;
        } else if (className === 'petal') {
            style.width = `${5 + Math.random() * 5}px`;
            style.height = style.width;
            (style as any)['--wind-direction'] = String(Math.random() - 0.5);
            style.animationDuration = `${10 + Math.random() * 10}s`;
        } else if (className === 'ink-splash') {
            const size = 50 + Math.random() * 100;
            style.width = `${size}px`;
            style.height = `${size}px`;
            style.top = `${Math.random() * 100}%`;
            style.left = `${Math.random() * 100}%`;
            style.animationDelay = `${Math.random() * 8}s`;
            style.animationDuration = `${4 + Math.random() * 4}s`;
        } else if (className === 'dust-particle') {
            const size = 1 + Math.random() * 2;
            style.width = `${size}px`;
            style.height = `${size}px`;
            style.top = `${Math.random() * 100}%`;
            style.left = `-${10 + Math.random() * 10}%`;
            style.animationDelay = `${Math.random() * 15}s`;
            style.animationDuration = `${10 + Math.random() * 10}s`;
        }


        // FIX: Replaced JSX syntax with React.createElement to be compatible with a .ts file extension.
        // This resolves parsing errors like "Cannot find name 'div'".
        return React.createElement('div', { key: i, className: className, style: style }, content ? content[i % content.length] : '');
    });
};