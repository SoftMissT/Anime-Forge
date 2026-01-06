import React, { useState, useEffect } from 'react';

interface TypingLoaderProps {
  text: string;
  speed?: number;
  className?: string;
}

export const TypingLoader: React.FC<TypingLoaderProps> = ({ text, speed = 50, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    if (text) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);
      return () => clearInterval(typingInterval);
    }
  }, [text, speed]);

  return (
    <div className={`typing-loader ${className}`}>
      {displayedText}
      <span className="typing-cursor">|</span>
    </div>
  );
};