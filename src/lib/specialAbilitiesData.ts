// lib/specialAbilitiesData.ts

export interface SpecialAbility {
    name: string;
    description: string;
    type: 'Passiva' | 'Ativa' | 'Reação';
}

export const SPECIAL_ABILITIES_DATA: SpecialAbility[] = [
    { 
        name: 'Visão Aguçada', 
        description: 'Conceito: Olhos além do humano, percebe detalhes e ilusões fracas.\nEfeito: +2 Percepção Visual, +1 Acerto, +1 Esquiva, detecção passiva de truques visuais.', 
        type: 'Passiva' 
    },
    { 
        name: 'Audição Sobrenatural', 
        description: 'Conceito: Ouve intenções/passos, revela inimigos ocultos.\nEfeito: +2 Percepção Auditiva, detecção tátil no escuro, pode localizar sons para se guiar.', 
        type: 'Passiva' 
    },
    { 
        name: 'Olfato Sobrenatural', 
        description: 'Conceito: Nariz que lê sangue, veneno e emoção.\nEfeito: +2 Percepção Olfativa, identifica Onis/humanos e venenos (MEN CD12), detecta presença demoníaca recente.', 
        type: 'Passiva' 
    },
    { 
        name: 'Tato Sensitivo', 
        description: 'Conceito: Pele que sente vibrações e intenções próximas.\nEfeito: Vantagem contra emboscadas; detecta vibrações em ambientes.', 
        type: 'Passiva' 
    },
    { 
        name: 'Metamorfose Carnívora', 
        description: 'Conceito: Queima COR para imitar risco e recompensa.\nEfeito: Pode consumir carne de Oni em combate (teste de COR) para ganhar traços do Oni por 1 cena; se for Oni de Lua, COR CD18 para vantagem temporária, resistência a venenos demoníacos.', 
        type: 'Ativa' 
    },
    { 
        name: 'Marechi', 
        description: 'Conceito: Sangue especial que atrai e dá vantagem contra Onis.\nEfeito: Vantagem em acerto contra Onis; resistência a dano demoníaco. Ao sofrer dano, Onis num raio de 12m ganham +1 Acerto e +1 Movimento contra você até o fim do combate.', 
        type: 'Passiva' 
    },
    { 
        name: 'Tsuyoi', 
        description: 'Conceito: Força física além do normal ou "Forte".\nEfeito: +1 em todos testes de Corpo/Vigor; abaixo de 25% PV, ganha +1 de dano, mas perde -2 de Esquiva e deve tentar manter-se consciente o PV (MEN CD14, 1x/descanso longo).', 
        type: 'Passiva' 
    },
    { 
        name: 'Oketsu', 
        description: 'Conceito: Sangue "divino/amaldiçoado" com poder e custo.\nEfeito: Vantagem contra Onis em Acerto/Esquiva; +2 PC por nível, mas se o sangue for tirado à força (Oni), ou ficam paralisados (Luas Superiores CD12). Após combate, sobrecarga corporal -> COR CD15 ou sofre 1d4 dano interno e -1 em resistência até descanso completo.', 
        type: 'Passiva' 
    },
];
