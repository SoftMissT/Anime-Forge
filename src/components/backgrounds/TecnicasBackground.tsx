
import React, { useMemo, memo } from 'react';
import { createParticles } from './particleUtils';

const TecnicasBackgroundComponent = () => {
    const bolts = useMemo(() => createParticles(5, 'lightning-bolt'), []);
    return <div className="lightning-container">{bolts}</div>;
};

export const TecnicasBackground = memo(TecnicasBackgroundComponent);
TecnicasBackground.displayName = 'TecnicasBackground';
