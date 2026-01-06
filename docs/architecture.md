# Documentação Estruturada — Arquitetura do Kimetsu Forge

## 1. Visão Geral

O Kimetsu Forge é uma aplicação full‑stack moderna com frontend em **Vite + React + TypeScript** e backend em **Next.js apenas para rotas de API serverless**. O sistema combina geração de conteúdo via IA, autenticação com Discord e persistência de dados distribuída.

A filosofia central: **frontend = experiência**, **backend = orquestração e segurança**.

---

## 2. Fluxo Global de Uso (do Login à Criação)

1. **Login via Discord** → usuário autoriza.
2. **Callback** → backend troca o *code* pelo *access_token*, obtém o perfil e verifica whitelist no Google Sheets.
3. **Sessão** → backend sela o perfil do usuário e grava no cookie HttpOnly.
4. **Frontend carrega** → AppContext lê a sessão via `/api/auth/me`.
5. **Carregamento de dados**:

   * Chaves de API do usuário (Supabase).
   * Histórico de criações (Turso).
6. **Interação e filtros** → usuário ajusta e clica em "Forjar".
7. **Backend gera conteúdo via IA**, valida, salva e devolve.
8. **UI atualiza** com o novo item.

---

## 3. Autenticação e Whitelist (Discord + Sheets)

### Fluxo resumido

1. Front chama `/api/auth/discord/url`.
2. Usuário autoriza → Discord redireciona para `/api/auth/discord/callback`.
3. Backend:

   * troca o code por access_token;
   * busca perfil;
   * consulta whitelist no Google Sheets;
   * se aprovado: cria sessão selada (`user-session`).
4. Em toda API subsequente, backend dessela o cookie e autentica.

### Segurança

* Cookie **HttpOnly**.
* Sessão criptografada com **SESSION_SECRET**.
* Comunicação servidor‑para‑servidor com Discord.

---

## 4. Motor de Criação (Forja)

### 4.1 Interface

* Usuário ajusta filtros no `FilterBar`.
* `ForgeProvider` mantém estado.
* Ao clicar em "Forjar" → `orchestrateGeneration()` envia dados para `/api/generateContent`.

### 4.2 Backend

O backend processa em quatro passos:

#### 1) Construção do Prompt

Usa `promptBuilder.ts` para montar:

* contexto temático;
* template JSON específico da categoria;
* filtros do usuário;
* modificador de prompt customizado.

#### 2) Orquestração de Modelos de IA

`modelOrchestrator.ts` segue a ordem:

* **Gemini (principal)**;
* **Hugging Face**;
* **TogetherAI**.

Papel dos modelos:

* **Gemini** → geração complexa de JSON + imagens + vídeos + Mestre.
* **OpenAI** → narrativa otimizada para imagem (Alquimia).
* **DeepSeek** → expansão criativa inicial.

#### 3) Validação

`generationValidator.ts`:

* confere campos obrigatórios;
* checa limites (ex: nível 1–20);
* atribui score de qualidade;
* se ruim → regeneração.

#### 4) Persistência

* Gera `uuid` + timestamp.
* Salva em **Turso** (`creations`).
* Retorna ao frontend.

---

## 5. Arquitetura de Dados

### Turso (libSQL)

* Banco principal.
* Tabelas: `creations`, `master_tool_history`, `master_chat_history`.
* Schema criado no primeiro uso.

### Supabase (PostgreSQL)

* Armazena **chaves de API do usuário**.
* Tabela `user_api_keys` com **upsert**.

---

## 6. Fluxo das Chaves de API

1. Usuário abre `ApiKeysModal`.
2. Insere chaves (Gemini, OpenAI, DeepSeek).
3. Front envia para `/api/keys/save`.
4. Backend salva via upsert no Supabase.
5. Em requisições de IA, backend:

   * primeiro busca chave do usuário;
   * se não existir → usa chave padrão do sistema.

---

## 7. Sistema de Estilo e Temas

### Base

* Tailwind CSS.
* Design tokens em `globals.css` (`--bg-primary`, `--text-primary` etc.).

### Temas Dinâmicos por Aba

* Cada view tem classe: `.view-forge`, `.view-characters`, etc.
* O componente `App.tsx` injeta `view-${activeView}`.
* Variáveis de cor mudam automaticamente.
* `AnimatedThemedBackground` gera fundos animados temáticos.

---

## 8. Configuração do Projeto

### Frontend — Vite

* `vite.config.ts` define plugins + aliases (`@` → `src`).

### Backend — Next.js API Routes

* Toda lógica sensível fica nas rotas serverless.
* Variáveis sensíveis via `.env` (SESSION_SECRET, tokens, URLs).
