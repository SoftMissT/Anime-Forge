
import React, { useMemo, memo } from 'react';
import { createParticles } from './particleUtils';

const ForjaBackgroundComponent = () => {
    const sparks = useMemo(() => createParticles(20, 'spark'), []);
    return <div className="spark-container">{sparks}</div>;
};

export const ForjaBackground = memo(ForjaBackgroundComponent);
ForjaBackground.displayName = 'ForjaBackground';
