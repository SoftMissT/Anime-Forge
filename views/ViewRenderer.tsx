import React from 'react';
// FIX: Added View to types.ts export
import type { View } from '../types';
import ForgeInterface from './ForgeInterface';
import ConflictsInterface from './ConflictsInterface';
import CharactersInterface from './CharactersInterface';
import TechniquesInterface from './TechniquesInterface';
import LocationsInterface from './LocationsInterface';
import MasterToolsInterface from './MasterToolsInterface';
import AlchemistInterface from './AlchemistInterface';
import CosmakerInterface from './CosmakerInterface';
import FilmmakerInterface from './FilmmakerInterface';
import { useAuth } from '../contexts/AppContext';
import { AuthOverlay } from '../components/AuthOverlay';
// FIX: Added VIEWS to constants.tsx export
import { VIEWS } from '../constants';

// A map to associate view IDs with their corresponding components
const viewMap: Record<View, React.ComponentType> = {
  forge: ForgeInterface,
  conflicts: ConflictsInterface,
  characters: CharactersInterface,
  techniques: TechniquesInterface,
  locations: LocationsInterface,
  master_tools: MasterToolsInterface,
  alchemist: AlchemistInterface,
  cosmaker: CosmakerInterface,
  filmmaker: FilmmakerInterface,
};

interface ViewRendererProps {
  activeView: View;
}

export const ViewRenderer: React.FC<ViewRendererProps> = ({ activeView }) => {
  const { isAuthenticated, handleLoginClick } = useAuth();
  const ComponentToRender = viewMap[activeView] || viewMap['forge'];

  const activeViewData = VIEWS.find(v => v.id === activeView);
  const viewTitle = activeViewData ? `Acesso à ${activeViewData.label}` : "Acesso Restrito";

  // For this stage, all views are protected.
  const isProtectedView = true;

  return (
    <div className="relative flex-grow">
        <ComponentToRender />
        {!isAuthenticated && isProtectedView && (
            <AuthOverlay onLoginClick={handleLoginClick} title={viewTitle} />
        )}
    </div>
  );
};