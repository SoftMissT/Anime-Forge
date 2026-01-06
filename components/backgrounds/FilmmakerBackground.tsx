
import React, { useMemo, memo } from 'react';
import { createParticles } from './particleUtils';

const FilmmakerBackgroundComponent = () => {
    const dust = useMemo(() => createParticles(50, 'dust-particle'), []);
    return (
        <div className="projector-beam-container">
            <div className="projector-beam" />
            {dust}
        </div>
    );
};

export const FilmmakerBackground = memo(FilmmakerBackgroundComponent);
FilmmakerBackground.displayName = 'FilmmakerBackground';