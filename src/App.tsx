import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CoreUIProvider,
  AuthProvider,
  ForgeProvider,
  ApiKeysProvider,
  useAppCore,
  UsageProvider,
  AlchemyProvider,
  useForge,
} from './contexts/AppContext';
import { ToastProvider } from './components/ToastProvider';
import { Header } from './components/Header';
import { AboutModal } from './components/AboutModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ApiKeysModal } from './components/ApiKeysModal';
import { ErrorDisplay } from './components/ui/ErrorDisplay';
import { AnimatedThemedBackground } from './components/AnimatedThemedBackground';
import { OnboardingTour } from './components/OnboardingTour';
import ErrorBoundary from './components/ErrorBoundary';
import { TABS_DATA } from './lib/tabsData';
import { LibraryTome } from './components/LibraryTome';
import { DetailModal } from './components/DetailModal';

// Importando as 9 interfaces da nova estrutura de views
import { BattlefieldInterface } from './views/BattlefieldInterface';
import { WorkshopInterface } from './views/WorkshopInterface';
import { ShinobuLabInterface } from './views/ShinobuLabInterface';
import { PainterAtelierInterface } from './views/PainterAtelierInterface';
import { ProjectionRoomInterface } from './views/ProjectionRoomInterface';
import { OyakataRoomInterface } from './views/OyakataRoomInterface';
import { CartographerAtlasInterface } from './views/CartographerAtlasInterface';
import { HuntersRegistryInterface } from './views/HuntersRegistryInterface';
import { StylesGrimoireInterface } from './views/StylesGrimoireInterface';


const AppContent = () => {
  const {
    activeView,
    isAboutModalOpen, closeAboutModal, openAboutModal,
    isHowItWorksModalOpen, closeHowItWorksModal, openHowItWorksModal,
    isApiKeysModalOpen, closeApiKeysModal,
    isLibraryTomeOpen, closeLibraryTome, libraryTomeInitialState,
    appError, setAppError,
  } = useAppCore();
  
  const { 
    selectedItem, 
    setSelectedItem, 
    favorites, 
    toggleFavorite,
    history 
  } = useForge();

  const handleUpdateItem = (updatedItem: any) => {
    setSelectedItem(updatedItem);
  };

  const currentItemIndex = selectedItem ? history.findIndex(item => item.id === selectedItem.id) : -1;
  const canNavigateToNewer = currentItemIndex > 0;
  const canNavigateToOlder = currentItemIndex !== -1 && currentItemIndex < history.length - 1;

  const navigateToNewerItem = () => {
      if (canNavigateToNewer) {
          setSelectedItem(history[currentItemIndex - 1]);
      }
  };

  const navigateToOlderItem = () => {
      if (canNavigateToOlder) {
          setSelectedItem(history[currentItemIndex + 1]);
      }
  };

  const renderView = () => {
    const tabConfig = TABS_DATA.find(tab => tab.id === activeView);
    const effectiveView = tabConfig ? activeView : 'forge';

    switch (effectiveView) {
        case 'conflicts': return <BattlefieldInterface />;
        case 'forge': return <WorkshopInterface />;
        case 'alchemist': return <ShinobuLabInterface />;
        case 'cosmaker': return <PainterAtelierInterface />;
        case 'filmmaker': return <ProjectionRoomInterface />;
        case 'master_tools': return <OyakataRoomInterface />;
        case 'locations': return <CartographerAtlasInterface />;
        case 'characters': return <HuntersRegistryInterface />;
        case 'techniques': return <StylesGrimoireInterface />;
        default: return <WorkshopInterface />;
    }
  };

  return (
    <div className={`app-container view-${activeView}`}>
      <AnimatedThemedBackground view={activeView} />
      
      <div className="main-content">
        <Header onOpenAbout={openAboutModal} onOpenHowItWorks={openHowItWorksModal} />
        
        <main className="app-main-view flex-1 min-h-0">
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full w-full"
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>

      <AboutModal isOpen={isAboutModalOpen} onClose={closeAboutModal} />
      <HowItWorksModal isOpen={isHowItWorksModalOpen} onClose={closeHowItWorksModal} />
      <ApiKeysModal isOpen={isApiKeysModalOpen} onClose={closeApiKeysModal} />
      <LibraryTome isOpen={isLibraryTomeOpen} onClose={closeLibraryTome} initialState={libraryTomeInitialState} />
       <DetailModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        isFavorite={selectedItem ? favorites.some(fav => fav.id === selectedItem.id) : false}
        onToggleFavorite={toggleFavorite}
        onUpdate={handleUpdateItem}
        onGenerateVariant={() => {}}
        onNavigateNewer={navigateToNewerItem}
        onNavigateOlder={navigateToOlderItem}
        canNavigateNewer={canNavigateToNewer}
        canNavigateOlder={canNavigateToOlder}
      />
      
      <ErrorDisplay error={appError} onDismiss={() => setAppError(null)} onRetry={appError?.onRetry} />
      <OnboardingTour />
    </div>
  );
};

// Main App component that wraps everything with providers
const App = () => {
  return (
    <ToastProvider>
      <CoreUIProvider>
        <AuthProvider>
          <ApiKeysProvider>
            <UsageProvider>
              <AlchemyProvider>
                <ForgeProvider>
                    <AppContent />
                </ForgeProvider>
              </AlchemyProvider>
            </UsageProvider>
          </ApiKeysProvider>
        </AuthProvider>
      </CoreUIProvider>
    </ToastProvider>
  );
};

export default App;