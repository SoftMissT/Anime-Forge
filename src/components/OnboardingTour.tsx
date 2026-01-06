import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';

const TOUR_STEPS = [
  {
    target: '.filter-panel',
    title: '🔥 Forja de Lendas',
    content: 'Escolha uma categoria (Arma, Caçador, Oni...) e configure os filtros básicos. Não se preocupe - tudo tem valor "Aleatório" por padrão!',
    position: 'right' as const
  },
  {
    target: '.forge-button',
    title: '⚒️ Forjar seu Item',
    content: 'Clique aqui para começar a geração! Leva 8-15 segundos. A IA vai criar algo único baseado nos seus filtros.',
    position: 'top' as const
  },
  {
    target: '.results-panel',
    title: '📜 Seus Resultados',
    content: 'Seus itens aparecem aqui! Clique neles para ver detalhes completos, editar ou salvar nos favoritos.',
    position: 'left' as const
  },
  {
    target: '.prompt-modifier',
    title: '✨ Dica Pro',
    content: 'Use o "Modificador de Prompt" para ter controle total! Ex: "Foque em um estilo gótico sombrio"',
    position: 'bottom' as const
  }
];

export const OnboardingTour: React.FC = () => {
  const [isActive, setIsActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    // Mostrar apenas na primeira visita
    return !localStorage.getItem('kimetsu-forge-onboarding-completed');
  });
  const [currentStep, setCurrentStep] = useState(0);

  if (!isActive) return null;

  const step = TOUR_STEPS[currentStep];
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem('kimetsu-forge-onboarding-completed', 'true');
      setIsActive(false);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('kimetsu-forge-onboarding-completed', 'true');
    setIsActive(false);
  };

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Overlay escuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
          />
          
          {/* Tooltip */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[9999] bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-purple-500 rounded-lg shadow-2xl p-6 max-w-sm"
            style={{
              // Posicionar próximo ao target (simplificado)
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <h3 className="text-xl font-bold text-white mb-2 font-gangofthree">
              {step.title}
            </h3>
            <p className="text-gray-200 mb-4">
              {step.content}
            </p>
            
            {/* Progress */}
            <div className="flex gap-1 mb-4">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    i <= currentStep ? 'bg-purple-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleSkip} className="flex-1">
                Pular
              </Button>
              <Button onClick={handleNext} className="flex-1 forge-button">
                {isLastStep ? 'Começar!' : 'Próximo'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
