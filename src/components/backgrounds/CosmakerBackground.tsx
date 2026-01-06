
import React, { useMemo, memo } from 'react';
import { createParticles } from './particleUtils';

const CosmakerBackgroundComponent = () => {
    const splashes = useMemo(() => createParticles(15, 'ink-splash'), []);
    return <div className="ink-container">{splashes}</div>;
};

export const CosmakerBackground = memo(CosmakerBackgroundComponent);
CosmakerBackground.displayName = 'CosmakerBackground';