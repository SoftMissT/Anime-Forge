import React from 'react';
import { GlossaryTerm } from '../../lib/glossaryData';
import { BookOpenIcon } from '../icons';

interface InteractiveTextProps {
  text: string;
  glossary: GlossaryTerm[];
  onTermClick: (term: GlossaryTerm) => void;
}

export const InteractiveText: React.FC<InteractiveTextProps> = ({ text, glossary, onTermClick }) => {
  if (!text) return null;

  const terms = glossary.map(t => t.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  if (terms.length === 0) {
    return <>{text}</>;
  }

  const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        const matchingTerm = glossary.find(t => t.name.toLowerCase() === part.toLowerCase());
        if (matchingTerm) {
          return (
            <button
              key={index}
              className="interactive-term"
              onClick={() => onTermClick(matchingTerm)}
            >
              {part}
              <BookOpenIcon className="inline-block w-3 h-3 ml-1 opacity-60" />
            </button>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
};
