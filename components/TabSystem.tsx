// components/TabSystem.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAppCore } from '../contexts/AppContext';
import { TABS_DATA } from '../lib/tabsData';

export const TabSystem: React.FC = () => {
    const { activeView, changeView } = useAppCore();

    return (
        <nav className="tab-navigation-container">
            <div className="flex items-center justify-center gap-2 p-1.5 bg-black/20 rounded-xl border border-[var(--border-subtle)]">
                {TABS_DATA.map(tab => {
                    const isActive = activeView === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => changeView(tab.id)}
                            className={`tab-button ${isActive ? 'is-active' : ''}`}
                            aria-label={tab.name}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="tab-button-text">{tab.name}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="active-tab-glow"
                                    className="active-tab-glow"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default TabSystem;
