
import React, { memo } from 'react';

// The day/night cycle effect is handled purely by CSS animations on the .app-background
// container when the .view-locations class is active. This component is a placeholder.
const LocaisBackgroundComponent = () => <div />;

export const LocaisBackground = memo(LocaisBackgroundComponent);
LocaisBackground.displayName = 'LocaisBackground';