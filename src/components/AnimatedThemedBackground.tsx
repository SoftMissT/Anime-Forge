// components/AnimatedThemedBackground.tsx
import React, { useMemo, memo } from 'react';
import type { AppView } from '../types';
import { TABS_DATA } from '../lib/tabsData';

const createParticles = (count: number, className: string, content?: string[]) => {
    return Array.from({ length: count }).map((_, i) => {
        const style: React.CSSProperties = {
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
        };

        if (className === 'ember') {
            style.width = `${2 + Math.random() * 4}px`;
            style.height = style.width;
            // FIX: Corrigido o erro "style.setProperty is not a function".
            // Objetos de estilo do React são objetos JS simples e não têm o método setProperty.
            // Propriedades CSS personalizadas são definidas atribuindo-as como chaves no objeto de estilo.
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
        }

        return <div key={i} className={className} style={style}>{content ? content[i % content.length] : ''}</div>;
    });
};

const FlamesBackground = memo(() => {
    const embers = useMemo(() => createParticles(30, 'ember'), []);
    return <div className="ember-container">{embers}</div>;
});
FlamesBackground.displayName = 'FlamesBackground';

const SparksBackground = memo(() => {
    const sparks = useMemo(() => createParticles(20, 'spark'), []);
    return <div className="spark-container">{sparks}</div>;
});
SparksBackground.displayName = 'SparksBackground';

const RunesBackground = memo(() => {
    const runes = useMemo(() => createParticles(25, 'rune', ['術', '霊', '封', '力', '光']), []);
    return <div className="rune-container">{runes}</div>;
});
RunesBackground.displayName = 'RunesBackground';

const LeavesBackground = memo(() => {
    const leaves = useMemo(() => createParticles(20, 'leaf'), []);
    return <div className="leaf-container">{leaves}</div>;
});
LeavesBackground.displayName = 'LeavesBackground';

const AuraBackground = memo(() => <div />); // Handled purely by CSS pseudo-element
AuraBackground.displayName = 'AuraBackground';

const LightningBackground = memo(() => {
    const bolts = useMemo(() => createParticles(5, 'lightning-bolt'), []);
    return <div className="lightning-container">{bolts}</div>;
});
LightningBackground.displayName = 'LightningBackground';

const BubblesBackground = memo(() => {
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
});
BubblesBackground.displayName = 'BubblesBackground';


const AnimatedThemedBackgroundComponent: React.FC<{ view: AppView }> = ({ view }) => {
    const tabData = TABS_DATA.find(tab => tab.id === view);
    const theme = tabData?.themeColor;

    const renderBackgroundEffect = () => {
        switch (theme) {
            case 'conflicts': return <FlamesBackground />;
            case 'forge': return <SparksBackground />;
            case 'master_tools': return <RunesBackground />;
            case 'locations': return <LeavesBackground />;
            case 'characters': return <AuraBackground />;
            case 'techniques': return <LightningBackground />;
            case 'alchemist': return <BubblesBackground />;
            default:
                // Fallback for views without a specific theme (like cosmaker, filmmaker if added later)
                return <SparksBackground />;
        }
    };
    
    return (
        <div 
            className="app-background" 
            aria-hidden="true" 
        >
           {renderBackgroundEffect()}
        </div>
    );
};

export const AnimatedThemedBackground = memo(AnimatedThemedBackgroundComponent);
AnimatedThemedBackground.displayName = 'AnimatedThemedBackground';
