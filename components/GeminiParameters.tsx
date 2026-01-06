import React from 'react';
// FIX: The import path is correct. The error was that the types.ts file was a placeholder. Now that it is implemented, this import resolves correctly.
import type { GeminiParameters } from '../types';
import { Card } from './ui/Card';
import { Select } from './ui/Select';

interface GeminiParametersProps {
  params: GeminiParameters;
  setParams: React.Dispatch<React.SetStateAction<GeminiParameters>>;
}

export const GeminiParametersComponent: React.FC<GeminiParametersProps> = ({ params, setParams }) => {
  const handleParamChange = (key: keyof GeminiParameters, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const artStyles = ["Anime/Manga", "Photorealistic", "Concept Art", "Digital Painting", "3D Render", "Pixel Art", "Fantasy Art"];
  const lightings = ["Cinematic Lighting", "Dramatic Lighting", "Soft Lighting", "Studio Lighting", "Natural Light", "Neon Glow"];
  const colorPalettes = ["Vibrant", "Monochromatic", "Pastel", "Dark & Moody", "Warm Tones", "Cool Tones"];
  const compositions = ["Dynamic Angle", "Close-up Shot", "Wide Angle", "Symmetrical", "Rule of Thirds", "Top-down view"];
  const detailLevels = ["Detailed", "Hyper-detailed", "Minimalist", "Stylized"];

  return (
    <div className="space-y-4">
        {/* FIX: Refactored Select components to use the options prop and correct onChange handler */}
        <Select label="Estilo de Arte" options={artStyles} value={params.artStyle} onChange={(value) => handleParamChange('artStyle', value)} />
        <Select label="Iluminação" options={lightings} value={params.lighting} onChange={(value) => handleParamChange('lighting', value)} />
        <Select label="Paleta de Cores" options={colorPalettes} value={params.colorPalette} onChange={(value) => handleParamChange('colorPalette', value)} />
        <Select label="Composição" options={compositions} value={params.composition} onChange={(value) => handleParamChange('composition', value)} />
        <Select label="Nível de Detalhe" options={detailLevels} value={params.detailLevel} onChange={(value) => handleParamChange('detailLevel', value)} />
      </div>
  );
};
