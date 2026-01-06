

import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: 'center' | 'drawer-left';
  panelClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, variant = 'center', panelClassName = '' }) => {
  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered) return null;

  const isDrawer = variant === 'drawer-left';

  const panelBaseClasses = `bg-gray-800 border-gray-700 flex flex-col transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`;
  
  const panelVariantClasses = {
      center: `rounded-lg shadow-xl p-6 w-full max-w-2xl border ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`,
      'drawer-left': `h-full w-full max-w-sm border-r ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
  };
  
  const backdropClasses = `fixed inset-0 bg-black z-50 transition-opacity duration-300 ease-out ${isOpen ? 'bg-opacity-75' : 'bg-opacity-0 pointer-events-none'}`;
  
  const containerClasses = isDrawer 
    ? 'fixed top-0 left-0 h-full z-50' 
    : 'fixed inset-0 flex items-center justify-center z-50 p-4';

  return (
    <div 
      className={backdropClasses}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`${containerClasses}`}
      >
        <div 
            className={`${panelBaseClasses} ${panelVariantClasses[variant]} ${panelClassName}`}
            onClick={(e) => e.stopPropagation()}
        >
            {title && (
              <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
                <h2 className="text-xl font-bold text-white font-gangofthree">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
              </div>
            )}
            <div className={isDrawer ? 'flex-grow overflow-y-auto' : ''}>
                {children}
            </div>
        </div>
      </div>
    </div>
  );
};