// lib/textFormatters.ts

import type { GeneratedItem, OniItem } from '../types';

function isStringArray(arr: any): arr is string[] {
    return Array.isArray(arr) && arr.every(item => typeof item === 'string');
}

export const buildPlainTextForItem = (item: GeneratedItem): string => {
    let text = `Nome: ${('title' in item && item.title) || item.nome || 'N/A'}\n`;
    text += `Categoria: ${item.categoria}\n`;
    text += `Raridade: ${item.raridade}\n`;
    if('nivel_sugerido' in item && item.nivel_sugerido) text += `Nível Sugerido: ${item.nivel_sugerido}\n`;
    if('preco_sugerido' in item && item.preco_sugerido) text += `Preço Sugerido: ${item.preco_sugerido} ryo\n`;
    
    text += `\n--- DESCRIÇÃO ---\n`;
    text += `${item.descricao_curta}\n\n`;
    text += `${item.descricao || ''}\n`;

    if (item.categoria === 'Arma' || item.categoria === 'Acessório' || item.categoria === 'Kekkijutsu') {
        if ('dano' in item) {
            text += `\n--- MECÂNICAS ---\n`;
            text += `Dano: ${item.dano || 'N/A'}\n`;
            if('dados' in item) text += `Dados: ${item.dados || 'N/A'}\n`;
            if('tipo_de_dano' in item) text += `Tipo de Dano: ${item.tipo_de_dano || 'N/A'}\n`;
            if ('status_aplicado' in item && item.status_aplicado) text += `Status: ${item.status_aplicado}\n`;
            if ('efeitos_secundarios' in item && item.efeitos_secundarios) text += `Efeitos Secundários: ${item.efeitos_secundarios}\n`;
        }
    }

    if (item.ganchos_narrativos) {
        text += `\n--- GANCHOS NARRATIVOS ---\n`;
        if (isStringArray(item.ganchos_narrativos)) {
            item.ganchos_narrativos.forEach(hook => text += `- ${hook}\n`);
        } else {
            text += `${item.ganchos_narrativos}\n`;
        }
    }

    if (item.categoria === 'Caçador') {
        text += `\n--- DETALHES DO CAÇADOR ---\n`;
        if ('classe' in item && item.classe) text += `Arquétipo: ${item.classe}\n`;
        if ('personalidade' in item && item.personalidade) text += `Personalidade: ${item.personalidade}\n`;
        if ('background' in item && item.background) text += `Background: ${item.background}\n`;
    }
    
    if (item.categoria === 'Inimigo/Oni') {
        text += `\n--- DETALHES DO ONI ---\n`;
        if ('power_level' in item && item.power_level) text += `Nível de Poder: ${item.power_level}\n`;
        if ('kekkijutsu' in item && item.kekkijutsu?.nome) text += `Kekkijutsu: ${item.kekkijutsu.nome} - ${item.kekkijutsu.descricao}\n`;
        if ('comportamento_combate' in item && item.comportamento_combate?.length) {
            text += `\nComportamento em Combate:\n`;
            item.comportamento_combate.forEach((b: string) => text += `- ${b}\n`);
        }
    }

    return text.trim();
};