import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  wrapperClassName?: string;
  forceOpen?: boolean;
  // FIX: Added `defaultOpen` prop to allow parent component to control the initial open state.
  defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children, wrapperClassName = '', forceOpen, defaultOpen = false }) => {
  // FIX: Initialize the open state using the `defaultOpen` prop.
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (forceOpen !== undefined) {
      setIsOpen(forceOpen);
    }
  }, [forceOpen]);

  return (
    <div className={`collapsible-section ${wrapperClassName} ${isOpen ? 'open' : ''}`}>
      <button 
        className="collapsible-header"
        onClick={() => setIsOpen(!isOpen)}
        disabled={forceOpen}
        aria-expanded={isOpen}
      >
        <h3 className="text-md font-semibold text-white">{title}</h3>
        {!forceOpen && <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto', marginTop: '1rem' },
              collapsed: { opacity: 0, height: 0, marginTop: 0 }
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};