

// FIX: Added the missing React import to resolve the "Cannot find namespace 'React'" error.
import React from 'react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export const SuccessConfetti: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  useEffect(() => {
    if (trigger) {
      // Confetti da esquerda
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: ['#8b5cf6', '#ec4899', '#f59e0b']
      });
      
      // Confetti da direita
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { x: 1, y: 0.6 },
          colors: ['#8b5cf6', '#ec4899', '#f59e0b']
        });
      }, 200);
    }
  }, [trigger]);

  return null;
};
