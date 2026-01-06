// src/views/CartographerAtlasInterface.tsx
import React from 'react';
import { WorkshopInterface } from './WorkshopInterface';
import { TABS_DATA } from '../lib/tabsData';

export const CartographerAtlasInterface: React.FC = () => {
    const tabConfig = TABS_DATA.find(tab => tab.id === 'locations');
    return (
        <WorkshopInterface
            key="locations"
            initialCategory={tabConfig?.defaultCategory}
            allowedCategories={tabConfig?.allowedCategories}
        />
    );
};
