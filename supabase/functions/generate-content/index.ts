// supabase/functions/generate-content/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { GoogleGenAI, Type } from "npm:@google/genai";

// FIX: Add a type declaration for the Deno global object to resolve TypeScript errors.
declare const Deno: any;

// Lógica do prompt builder e schemas (simplificada e in-line para Deno)
const buildPrompt = (filters: any) => `Gere um item para um RPG de Demon Slayer com base em: ${JSON.stringify(filters)}. Retorne um objeto JSON com "title" e "description".`;

const handleForge = async (filters: any, ai: GoogleGenAI) => {
    const { category, rarity, level, thematics, country, era, tonalidade, promptModifier, quantity } = filters;
    const fullPrompt = `
      Você é um mestre contador de histórias e especialista no universo de Kimetsu no Yaiba.
      Sua tarefa é gerar ${quantity} ideia(s) criativa(s) com base nos seguintes parâmetros:
      - Categoria: ${category}
      - Raridade: ${rarity}
      - Nível Sugerido: ${level}
      - Temática(s): ${thematics.join(', ') || 'Nenhuma'}
      - Inspiração Cultural: ${country} / ${era}
      - Tonalidade: ${tonalidade}
      - Instrução Adicional: ${promptModifier}
      Gere uma resposta em formato JSON. A resposta DEVE ser um array de objetos JSON, mesmo que a quantidade seja 1. Cada objeto deve ter um título ("title") e uma descrição ("description").
    `;

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                    },
                    required: ['title', 'description']
                }
            },
            temperature: 0.8,
        }
    });
    
    return JSON.parse(result.text);
};


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { view, filters } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY não está configurada nas variáveis de ambiente da função.");
    }
    const ai = new GoogleGenAI({ apiKey });
    
    let result;
    // Adicione mais casos aqui para outras views conforme necessário
    switch (view) {
        case 'forge':
            result = await handleForge(filters, ai);
            break;
        default:
            return new Response(JSON.stringify({ error: 'View inválida' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});