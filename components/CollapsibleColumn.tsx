// FIX: Implemented the CollapsibleColumn component to resolve the module import error. This component provides animated collapsible side panels for the UI.
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { Tooltip } from './ui/Tooltip';

interface CollapsibleColumnProps {
  position: 'left' | 'right';
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string; // Expects a Tailwind width class like w-[420px]
  // FIX: Changed React.Node to React.ReactNode. React.Node is a deprecated type alias and using the official React.ReactNode type is safer and prevents potential TypeScript errors.
  children: React.ReactNode;
}

export const CollapsibleColumn: React.FC<CollapsibleColumnProps> = ({
  position,
  isCollapsed,
  onToggle,
  className,
  children,
}) => {
  // Parse width from Tailwind class, e.g., w-[420px] -> 420
  const expandedWidth = className ? parseInt(className.match(/w-\[(\d+)px\]/)?.[1] || '400', 10) : 400;
  const collapsedWidth = 0;

  const Icon = position === 'left' ? ChevronLeftIcon : ChevronRightIcon;

  return (
      <motion.div
          initial={false}
          animate={{ width: isCollapsed ? collapsedWidth : expandedWidth }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          className={`relative h-full flex-shrink-0 collapsible-column-component ${className}`}
      >
          <div className="h-full overflow-hidden" style={{ width: expandedWidth }}>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="h-full"
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <Tooltip text={isCollapsed ? 'Expandir' : 'Recolher'} position={position === 'left' ? 'right' : 'left'}>
              <button 
                  onClick={onToggle}
                  className={`collapsible-column-toggle absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-r-md
                      ${position === 'left' ? 'right-0 translate-x-full' : 'left-0 -translate-x-full'}`}
              >
                  <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <Icon className="w-5 h-5 text-gray-400" />
                  </motion.div>
              </button>
          </Tooltip>
      </motion.div>
  );
};
