
import React, { useMemo, memo } from 'react';
import { createParticles } from './particleUtils';

const PersonagensBackgroundComponent = () => {
    const petals = useMemo(() => createParticles(30, 'petal'), []);
    return <div className="petal-container">{petals}</div>;
};

export const PersonagensBackground = memo(PersonagensBackgroundComponent);
PersonagensBackground.displayName = 'PersonagensBackground';