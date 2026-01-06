// lib/generationValidator.ts - SISTEMA DE VALIDAÇÃO E ESTABILIDADE

// FIX: The import path is correct. The error was that the types.ts file was a placeholder. Now that it is implemented, this import resolves correctly.
import type { GeneratedItem, FilterState } from '../types';

// ===== REGRAS DE VALIDAÇÃO POR CATEGORIA =====
interface ValidationRule {
  field: string;
  validator: (value: any) => boolean;
  errorMessage: string;
  required: boolean;
}

const VALIDATION_RULES: Record<string, ValidationRule[]> = {
  // Regras para TODAS as categorias
  common: [
    {
      field: 'nome',
      validator: (v) => typeof v === 'string' && v.length >= 3 && v.length <= 100,
      errorMessage: 'Nome deve ter entre 3 e 100 caracteres',
      required: true
    },
    {
      field: 'descricao_curta',
      validator: (v) => typeof v === 'string' && v.length >= 30 && v.length <= 220,
      errorMessage: 'Descrição curta deve ter entre 30 e 220 caracteres',
      required: true
    },
    {
      field: 'descricao',
      validator: (v) => typeof v === 'string' && v.length >= 100 && v.length <= 2000,
      errorMessage: 'Descrição detalhada deve ter entre 100 e 2000 caracteres',
      required: true
    },
    {
      field: 'raridade',
      validator: (v) => ['Comum', 'Incomum', 'Rara', 'Épica', 'Lendária'].includes(v),
      errorMessage: 'Raridade inválida',
      required: true
    },
    {
      field: 'nivel_sugerido',
      validator: (v) => typeof v === 'number' && v >= 1 && v <= 20,
      errorMessage: 'Nível deve estar entre 1 e 20',
      required: true
    },
    {
      field: 'ganchos_narrativos',
      validator: (v) => Array.isArray(v) && v.length >= 3 && v.every(h => typeof h === 'string' && h.length >= 20),
      errorMessage: 'Deve haver pelo menos 3 ganchos com mínimo 20 caracteres cada',
      required: true
    },
    {
      field: 'imagePromptDescription',
      validator: (v) => typeof v === 'string' && v.length >= 40 && v.length <= 500,
      errorMessage: 'Prompt de imagem deve ter entre 40 e 500 caracteres',
      required: true
    }
  ],

  // Regras específicas para ARMAS
  'Arma': [
    {
      field: 'dano',
      validator: (v) => typeof v === 'string' && v.length > 0,
      errorMessage: 'Dano é obrigatório para armas',
      required: true
    },
    {
      field: 'dados',
      validator: (v) => typeof v === 'string' && /\d+d\d+/.test(v),
      errorMessage: 'Dados devem estar no formato XdY (ex: 2d8)',
      required: true
    },
    {
      field: 'tipo_de_dano',
      validator: (v) => typeof v === 'string' && v.length > 0,
      errorMessage: 'Tipo de dano é obrigatório',
      required: true
    },
    {
      field: 'preco_sugerido',
      validator: (v) => typeof v === 'number' && v > 0,
      errorMessage: 'Preço deve ser maior que 0',
      required: true
    }
  ],

  // Regras para CAÇADORES e NPCs
  'Caçador': [
    {
      field: 'classe',
      validator: (v) => typeof v === 'string' && v.length >= 5 && v.length <= 50,
      errorMessage: 'Classe deve ter entre 5 e 50 caracteres',
      required: true
    },
    {
      field: 'personalidade',
      validator: (v) => typeof v === 'string' && v.length >= 30,
      errorMessage: 'Personalidade deve ter pelo menos 30 caracteres',
      required: true
    },
    {
      field: 'background',
      validator: (v) => typeof v === 'string' && v.length >= 100,
      errorMessage: 'Background deve ter pelo menos 100 caracteres',
      required: true
    }
  ],

  // Regras para ONIS
  'Inimigo/Oni': [
    {
      field: 'power_level',
      validator: (v) => typeof v === 'string' && v.length > 0,
      errorMessage: 'Nível de poder é obrigatório',
      required: true
    },
    {
      field: 'kekkijutsu',
      validator: (v) => 
        v && 
        v.nome && typeof v.nome === 'string' &&
        v.descricao && typeof v.descricao === 'string' && v.descricao.length >= 50 &&
        v.tipo && typeof v.tipo === 'string' &&
        v.custo_pc != null && typeof v.custo_pc === 'number' && v.custo_pc >= 0 && v.custo_pc <= 10,
      errorMessage: 'Kekkijutsu deve ter nome, descrição (min. 50 chars), tipo e custo de PC (0-10) válidos',
      required: true
    },
    {
      field: 'comportamento_combate',
      validator: (v) => Array.isArray(v) && v.length >= 3 && v.every(c => c.length >= 15),
      errorMessage: 'Deve haver pelo menos 3 táticas de combate (min. 15 chars cada)',
      required: true
    }
  ]
};

// Use as mesmas regras para categorias similares
VALIDATION_RULES['Acessório'] = VALIDATION_RULES['Arma'];
VALIDATION_RULES['NPC'] = VALIDATION_RULES['Caçador'];

// ===== VALIDADOR PRINCIPAL =====
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100, qualidade geral
}

export function validateGeneratedItem(
  item: any,
  category: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // Validação básica: item existe
  if (!item || typeof item !== 'object') {
    return {
      isValid: false,
      errors: ['Item é nulo ou inválido'],
      warnings: [],
      score: 0
    };
  }

  // Aplicar regras comuns
  const commonRules = VALIDATION_RULES.common || [];
  for (const rule of commonRules) {
    const value = item[rule.field];
    
    if (rule.required && (value === undefined || value === null)) {
      errors.push(`Campo obrigatório ausente: ${rule.field}`);
      score -= 15;
      continue;
    }

    if (value !== undefined && value !== null && !rule.validator(value)) {
      if (rule.required) {
        errors.push(rule.errorMessage);
        score -= 10;
      } else {
        warnings.push(rule.errorMessage);
        score -= 5;
      }
    }
  }

  // Aplicar regras específicas da categoria
  const categoryRules = VALIDATION_RULES[category] || [];
  for (const rule of categoryRules) {
    const value = item[rule.field];
    
    if (rule.required && (value === undefined || value === null)) {
      errors.push(`Campo específico ausente para ${category}: ${rule.field}`);
      score -= 15;
      continue;
    }

    if (value !== undefined && value !== null && !rule.validator(value)) {
      if (rule.required) {
        errors.push(rule.errorMessage);
        score -= 10;
      } else {
        warnings.push(rule.errorMessage);
        score -= 5;
      }
    }
  }

  // Validações adicionais de qualidade
  if (item.descricao_curta === item.descricao) {
    warnings.push('Descrição curta e detalhada são idênticas');
    score -= 5;
  }

  if (item.nome && item.nome.toLowerCase().includes('untitled')) {
    warnings.push('Nome parece ser placeholder');
    score -= 10;
  }

  // Verificar se prompt de imagem está em inglês
  if (item.imagePromptDescription) {
    const portugueseWords = /\b(de|da|do|em|para|com|uma|um|o|a)\b/gi;
    const matches = item.imagePromptDescription.match(portugueseWords);
    if (matches && matches.length > 2) {
      warnings.push('Prompt de imagem parece estar em português (deveria ser inglês)');
      score -= 5;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score)
  };
}

// ===== SISTEMA DE RETRY COM FEEDBACK =====
export async function generateWithRetry<T>(
  generateFn: () => Promise<T>,
  validateFn: (result: T) => ValidationResult,
  maxRetries: number = 2
): Promise<{ result: T; validation: ValidationResult; attempts: number }> {
  let lastResult: T | null = null;
  let lastValidation: ValidationResult | null = null;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    console.log(`🔄 Tentativa ${attempt}/${maxRetries + 1}...`);

    try {
      const result = await generateFn();
      lastResult = result;
      
      const validation = validateFn(result);
      lastValidation = validation;

      console.log(`📊 Validação: Score ${validation.score}/100`);
      
      if (validation.errors.length > 0) {
        console.warn(`❌ Erros encontrados:`, validation.errors);
      }
      if (validation.warnings.length > 0) {
        console.warn(`⚠️ Avisos:`, validation.warnings);
      }

      // Se score >= 70, aceitar resultado
      if (validation.score >= 70) {
        console.log(`✅ Resultado aceito na tentativa ${attempt}`);
        return { result, validation, attempts: attempt };
      }

      // Se é a última tentativa, retornar de qualquer forma
      if (attempt === maxRetries + 1) {
        console.warn(`⚠️ Usando resultado com score ${validation.score} (última tentativa)`);
        return { result, validation, attempts: attempt };
      }

      // Caso contrário, tentar novamente
      console.log(`🔄 Score ${validation.score} insuficiente, tentando novamente...`);
      
      // Delay antes do retry
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error: any) {
      console.error(`❌ Erro na tentativa ${attempt}:`, error.message);
      
      // Se é a última tentativa, lançar erro
      if (attempt === maxRetries + 1) {
        throw error;
      }
      
      // Delay maior após erro
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Fallback (nunca deve chegar aqui)
  if (lastResult && lastValidation) {
    return { result: lastResult, validation: lastValidation, attempts: maxRetries + 1 };
  }

  throw new Error('Falha em todas as tentativas de geração');
}

// ===== HELPER PARA CORRIGIR PROBLEMAS COMUNS =====
export function autoFixCommonIssues(item: any, category: string): any {
  const fixed = { ...item };

  // Garantir que categoria está correta
  fixed.categoria = category;

  // Truncar campos muito longos
  if (fixed.descricao && fixed.descricao.length > 2000) {
    fixed.descricao = fixed.descricao.substring(0, 1997) + '...';
  }

  // Limitar ganchos narrativos a 5 (máximo)
  if (Array.isArray(fixed.ganchos_narrativos) && fixed.ganchos_narrativos.length > 5) {
    fixed.ganchos_narrativos = fixed.ganchos_narrativos.slice(0, 5);
  }

  // Garantir que image prompt está em inglês (tradução básica de palavras comuns)
  if (fixed.imagePromptDescription) {
    const translations: Record<string, string> = {
      'katana': 'katana',
      'espada': 'sword',
      'demônio': 'demon',
      'guerreiro': 'warrior',
      'floresta': 'forest',
      'montanha': 'mountain',
      'noite': 'night',
      'lua': 'moon',
      'sangue': 'blood',
      'fogo': 'fire',
      'água': 'water',
      'vento': 'wind',
      'relâmpago': 'lightning',
      'trovão': 'thunder'
    };

    let prompt = fixed.imagePromptDescription;
    for (const [pt, en] of Object.entries(translations)) {
      prompt = prompt.replace(new RegExp(`\\b${pt}\\b`, 'gi'), en);
    }
    fixed.imagePromptDescription = prompt;
  }

  // Ajustar raridade para valores válidos
  if (fixed.raridade && !['Comum', 'Incomum', 'Rara', 'Épica', 'Lendária'].includes(fixed.raridade)) {
    fixed.raridade = 'Rara'; // Default seguro
  }

  // Garantir nível válido
  if (typeof fixed.nivel_sugerido === 'number') {
    fixed.nivel_sugerido = Math.max(1, Math.min(20, fixed.nivel_sugerido));
  }

  return fixed;
}

// ===== INTEGRAÇÃO COM ORCHESTRATION =====
export async function generateStableItem(
  filters: FilterState,
  generateFn: () => Promise<any>
): Promise<GeneratedItem> {
  const { result, validation, attempts } = await generateWithRetry(
    generateFn,
    (item) => validateGeneratedItem(item, filters.category),
    2 // Max 2 retries = 3 tentativas totais
  );

  // Aplicar correções automáticas
  const fixedResult = autoFixCommonIssues(result, filters.category);

  // Adicionar metadados de validação
  const finalResult: GeneratedItem = {
    ...fixedResult,
    _validation: {
      score: validation.score,
      attempts,
      warnings: validation.warnings,
      timestamp: new Date().toISOString()
    }
  };

  return finalResult;
}