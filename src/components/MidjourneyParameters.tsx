import React from 'react';
// FIX: Renamed the component to `MidjourneyParametersComponent` to avoid a name conflict with the `MidjourneyParameters` type from `types.ts`, which was causing a "merged declaration" error.
// FIX: The import path is correct. The error was that the types.ts file was a placeholder. Now that it is implemented, this import resolves correctly.
import type { MidjourneyParameters as MidjourneyParametersType } from '../types';
import { Switch } from './ui/Switch';
import { Select } from './ui/Select';
import { Slider } from './ui/Slider';
import { TextInput } from './ui/TextInput';

interface MidjourneyParametersProps {
  params: MidjourneyParametersType;
  setParams: React.Dispatch<React.SetStateAction<MidjourneyParametersType>>;
}

export const MidjourneyParametersComponent: React.FC<MidjourneyParametersProps> = ({ params, setParams }) => {

  const handleParamChange = <K extends keyof MidjourneyParametersType>(key: K, field: 'active' | 'value', value: any) => {
    setParams(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const versions = ["6.0", "5.2", "5.1", "Niji 6", "Niji 5"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <div>
          <Switch label="Versão" checked={params.version.active} onChange={e => handleParamChange('version', 'active', e.target.checked)} />
          {params.version.active && <Select options={versions} value={String(params.version.value)} onChange={v => handleParamChange('version', 'value', v)} label="" />}
        </div>
        <div>
          <Switch label="Proporção (Aspect Ratio)" checked={params.aspectRatio.active} onChange={e => handleParamChange('aspectRatio', 'active', e.target.checked)} />
          {params.aspectRatio.active && <TextInput value={String(params.aspectRatio.value)} onChange={e => handleParamChange('aspectRatio', 'value', e.target.value)} label="" />}
        </div>
      </div>
      <div>
        <Switch label="Estilo (Style)" checked={params.style.active} onChange={e => handleParamChange('style', 'active', e.target.checked)} />
        {params.style.active && <TextInput value={String(params.style.value)} onChange={e => handleParamChange('style', 'value', e.target.value)} label="" placeholder="raw, cute, expressive..." />}
      </div>
      
      <div>
        <Switch label="Estilização (Stylize)" checked={params.stylize.active} onChange={e => handleParamChange('stylize', 'active', e.target.checked)} />
        {params.stylize.active && <Slider label="" value={Number(params.stylize.value)} onChange={e => handleParamChange('stylize', 'value', Number(e.target.value))} min={0} max={1000} step={50} />}
      </div>
      <div>
        <Switch label="Caos (Chaos)" checked={params.chaos.active} onChange={e => handleParamChange('chaos', 'active', e.target.checked)} />
        {params.chaos.active && <Slider label="" value={Number(params.chaos.value)} onChange={e => handleParamChange('chaos', 'value', Number(e.target.value))} min={0} max={100} step={5} />}
      </div>
       <div>
        <Switch label="Esquisitice (Weird)" checked={params.weird.active} onChange={e => handleParamChange('weird', 'active', e.target.checked)} />
        {params.weird.active && <Slider label="" value={Number(params.weird.value)} onChange={e => handleParamChange('weird', 'value', Number(e.target.value))} min={0} max={3000} step={100} />}
      </div>
    </div>
  );
};