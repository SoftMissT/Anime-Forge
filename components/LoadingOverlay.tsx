import React from 'react';
import { motion } from 'framer-motion';
import { AnvilIcon } from './icons/AnvilIcon';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number; // 0-100
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isVisible, 
  message = 'Forjando sua lenda...', 
  progress 
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center"
      aria-live="assertive"
      role="alert"
    >
      <div className="text-center max-w-md px-4">
        {/* Animação de Bigorna */}
        <motion.div
          animate={{ 
            rotate: [0, -5, 5, -5, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <AnvilIcon className="w-24 h-24 mx-auto text-orange-500" />
        </motion.div>

        {/* Texto */}
        <h3 className="text-2xl font-bold font-gangofthree text-white mb-2">
          {message}
        </h3>
        
        {/* Progress Bar (se fornecido) */}
        {typeof progress === 'number' && (
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4 overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        )}
        
        {/* Dica Rotativa */}
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-400 text-sm"
        >
          💡 Dica: Use o modificador de prompt para resultados mais específicos
        </motion.p>
        
        {/* Tempo estimado */}
        <p className="text-gray-500 text-xs mt-4">
          Tempo estimado: 8-15 segundos
        </p>
      </div>
    </motion.div>
  );
};
