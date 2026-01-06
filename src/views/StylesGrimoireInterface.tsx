// src/views/StylesGrimoireInterface.tsx
import React from 'react';
import { WorkshopInterface } from './WorkshopInterface';
import { TABS_DATA } from '../lib/tabsData';

export const StylesGrimoireInterface: React.FC = () => {
    const tabConfig = TABS_DATA.find(tab => tab.id === 'techniques');
    return (
        <WorkshopInterface
            key="techniques"
            initialCategory={tabConfig?.defaultCategory}
            allowedCategories={tabConfig?.allowedCategories}
        />
    );
};
