import React from 'react';
// FIX: The import path is correct. The error was that the types.ts file was a placeholder. Now that it is implemented, this import resolves correctly.
import type { PromptGenerationResult } from '../types';
import { PromptCard } from './PromptCard';

interface PromptResultDisplayProps {
    results: PromptGenerationResult;
    onPromptChange: (model: 'midjourney' | 'gpt' | 'gemini', newPrompt: string) => void;
}

export const PromptResultDisplay: React.FC<PromptResultDisplayProps> = ({ results, onPromptChange }) => {
    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto inner-scroll">
            {results.midjourneyPrompt && (
                <PromptCard 
                    model="midjourney" 
                    prompt={results.midjourneyPrompt} 
                    onPromptChange={(newPrompt) => onPromptChange('midjourney', newPrompt)}
                />
            )}
            {results.gptPrompt && (
                <PromptCard 
                    model="gpt" 
                    prompt={results.gptPrompt}
                    onPromptChange={(newPrompt) => onPromptChange('gpt', newPrompt)}
                />
            )}
            {results.geminiPrompt && (
                <PromptCard 
                    model="gemini" 
                    prompt={results.geminiPrompt} 
                    onPromptChange={(newPrompt) => onPromptChange('gemini', newPrompt)}
                />
            )}
        </div>
    );
};