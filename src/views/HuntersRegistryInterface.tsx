// src/views/HuntersRegistryInterface.tsx
import React from 'react';
import { WorkshopInterface } from './WorkshopInterface';
import { TABS_DATA } from '../lib/tabsData';

export const HuntersRegistryInterface: React.FC = () => {
    const tabConfig = TABS_DATA.find(tab => tab.id === 'characters');
    return (
        <WorkshopInterface
            key="characters"
            initialCategory={tabConfig?.defaultCategory}
            allowedCategories={tabConfig?.allowedCategories}
        />
    );
};
