import React from 'react';
// FIX: The import path is correct. The error was that the types.ts file was a placeholder. Now that it is implemented, this import resolves correctly.
import type { GptParameters } from '../types';
import { Card } from './ui/Card';
import { Select } from './ui/Select';

interface GptStructuredBuilderProps {
  params: GptParameters;
  setParams: React.Dispatch<React.SetStateAction<GptParameters>>;
}

export const GptStructuredBuilder: React.FC<GptStructuredBuilderProps> = ({ params, setParams }) => {
  const handleParamChange = (key: keyof GptParameters, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const tones = ["Cinematic", "Dramatic", "Whimsical", "Dark & Moody", "Epic", "Serene"];
  const styles = ["Concept Art", "Photorealistic", "Digital Painting", "Illustration", "3D Render", "Pixel Art"];
  const compositions = ["Dynamic Angle", "Close-up Shot", "Wide Angle", "Symmetrical", "Rule of Thirds"];

  return (
     <div className="space-y-4">
        {/* FIX: Refactored Select components to use the options prop and correct onChange handler */}
        <Select label="Tom / Atmosfera" options={tones} value={params.tone} onChange={(value) => handleParamChange('tone', value)} />
        <Select label="Estilo de Arte" options={styles} value={params.style} onChange={(value) => handleParamChange('style', value)} />
        <Select label="Composição / Ângulo" options={compositions} value={params.composition} onChange={(value) => handleParamChange('composition', value)} />
      </div>
  );
};