# 🗺️ Mapa de Transformação: Do Legado para a Forja Sagrada

Este documento mapeia a jornada de cada artefato de código do repositório original para sua forma final na nova arquitetura (Vite + Supabase Edge Functions).

| Arquivo Original (Pré-transformação) | Ação Tomada | Novo Local / Destino | Justificativa |
| :--- | :--- | :--- | :--- |
| `index.html` | **Refatorado** | `/index.html` | Estrutura base preservada; `script` e `importmap` atualizados para o entrypoint do Vite. |
| `index.tsx` | **Convertido** | `/src/main.tsx` | Convertido no ponto de entrada padrão do Vite (`main.tsx`), renderizando o componente `App`. |
| `App.tsx` | **Refatorado e Movido** | `/src/App.tsx` | Unificado como componente raiz principal. Lógica de renderização de views adaptada para os novos nomes temáticos. |
| `package.json` | **Reconstruído** | `/package.json` | Totalmente reescrito para um projeto Vite, com dependências limpas e scripts para build em nuvem. |
| `vite.config.ts` | **Criado** | `/vite.config.ts` | Arquivo de configuração padrão do Vite, incluindo alias `@` para `src`. |
| `tsconfig.json` | **Criado** | `/tsconfig.json` | Configuração TypeScript moderna para projetos Vite + React. |
| `pages/index.tsx` | **Absorvido** | Lógica incorporada em `/src/main.tsx` | O entrypoint do Next.js foi substituído pelo fluxo do Vite. |
| `pages/_app.tsx` | **Absorvido** | `/src/App.tsx` e `/index.html` | Provedores e estilos globais agora são gerenciados no `App.tsx` e no `main.tsx`. |
| `pages/api/**/*` | **Convertido para Serverless** | `/supabase/functions/<nome-da-funcao>/` | Toda a lógica de backend foi migrada para Supabase Edge Functions para segurança e escalabilidade. |
| `lib/server/*` (ex: `turso.ts`) | **Adaptado para Deno** | `/supabase/functions/_shared/` | Lógica de servidor movida para módulos compartilhados no ambiente Deno das Edge Functions. |
| `lib/client/*` (ex: `orchestration.ts`) | **Refatorado** | `/src/services/` | Lógica de cliente (chamadas `fetch`) foi atualizada para apontar para os novos endpoints das Supabase Functions. |
| `components/**/*` | **Consolidado e Movido** | `/src/components/` | Todos os componentes de UI foram unificados, com duplicatas removidas e a melhor implementação preservada. |
| `views/**/*` | **Renomeado e Reestruturado** | `/src/views/` | As "páginas" foram renomeadas para nomes temáticos e organizadas como views principais da aplicação. |
| `styles/globals.css` | **Movido** | `/src/styles/globals.css` | Mantido e movido para a estrutura de pastas do Vite. |
| `types.ts` | **Movido** | `/src/types/index.ts` | Tipos globais movidos e centralizados. |
