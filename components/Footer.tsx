import React, { useEffect } from 'react';
import { aboutContent } from '../lib/aboutContent';
import { HeartIcon } from './icons/HeartIcon';

// FIX: Implemented Footer component to resolve placeholder errors.
interface FooterProps {
    onAboutClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAboutClick }) => {

  useEffect(() => {
    const openAbout = () => onAboutClick();
    document.addEventListener('openAboutModal', openAbout);
    return () => document.removeEventListener('openAboutModal', openAbout);
  }, [onAboutClick]);

  return (
    <footer className="text-xs text-center p-4 text-gray-500 border-t border-gray-800 mt-auto">
      <div dangerouslySetInnerHTML={{ __html: aboutContent.html_footer_snippet }} />
      <p className="mt-2">
        Feito com <HeartIcon className="w-3 h-3 inline-block text-red-500" /> por SoftMissT &amp; Mathzin.
      </p>
    </footer>
  );
};