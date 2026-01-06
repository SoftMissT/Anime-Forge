// lib/erasData.ts
export const ERAS_DATA: Record<string, { value: string; label: string }[]> = {
  'Japão (Feudal/Folclórico)': [
    { value: 'Aleatório', label: 'Aleatório' },
    { value: 'Era Sengoku', label: 'Sengoku (Estados Guerreiros)' },
    { value: 'Período Edo', label: 'Edo (Shogunato Tokugawa)' },
    { value: 'Era Meiji', label: 'Meiji (Restauração e Modernização)' },
    { value: 'Era Taishō', label: 'Taishō (Japão pré-guerra)' },
    { value: 'Período Heian', label: 'Heian (Corte Imperial Clássica)' },
  ],
  'China (Imperial/Wuxia)': [
    { value: 'Aleatório', label: 'Aleatório' },
    { value: 'Dinastia Han', label: 'Han (Rota da Seda)' },
    { value: 'Dinastia Tang', label: 'Tang (Era de Ouro)' },
    { value: 'Dinastia Ming', label: 'Ming (Grande Muralha)' },
    { value: 'Período dos Três Reinos', label: 'Três Reinos (Conflito Épico)' },
  ],
  'Inglaterra (Vitoriana/Gótica)': [
    { value: 'Aleatório', label: 'Aleatório' },
    { value: 'Era Vitoriana (Industrial)', label: 'Vitoriana (Industrial)' },
    { value: 'Era Regencial', label: 'Regencial (Napoleônica)' },
    { value: 'Período Tudor', label: 'Tudor (Henrique VIII)' },
  ],
  'Roma (Império Romano)': [
    { value: 'Aleatório', label: 'Aleatório' },
    { value: 'República Romana', label: 'República (Ascensão de Roma)' },
    { value: 'Império Romano (Pax Romana)', label: 'Império (Pax Romana)' },
    { value: 'Queda do Império', label: 'Queda do Império (Invasões Bárbaras)' },
  ],
  'Escandinávia (Nórdico/Viking)': [
    { value: 'Aleatório', label: 'Aleatório' },
    { value: 'Era Viking', label: 'Era Viking (Exploração e Raids)' },
    { value: 'União de Kalmar', label: 'União de Kalmar (Reinos Unidos)' },
  ],
};