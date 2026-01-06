# ✅ Checklist de Aceitação — Validação do Artefato

Este checklist valida a integridade funcional e visual da aplicação após a refatoração.

### Testes de Integração (Endpoints Serverless)

**Nota:** Substitua `[SUPABASE_PROJECT_REF]` pelo ID do seu projeto Supabase e `[SUPABASE_ANON_KEY]` pela sua chave anônima pública. O `[USER_SESSION_COOKIE]` deve ser obtido do navegador após o login via Discord.

#### Autenticação
- [ ] **GET `/auth-discord-url`:**
  - `curl -X GET "https://[SUPABASE_PROJECT_REF].supabase.co/functions/v1/auth-discord-url"`
  - **Critério:** Retorna um JSON `{"url": "https://discord.com/api/oauth2/authorize?..."}`.

- [ ] **GET `/auth-me` (sem cookie):**
  - `curl -X GET "https://[SUPABASE_PROJECT_REF].supabase.co/functions/v1/auth-me"`
  - **Critério:** Retorna `401 Unauthorized`.

- [ ] **GET `/auth-me` (com cookie):**
  - `curl -X GET -H "Cookie: user-session=[USER_SESSION_COOKIE]" "https://[SUPABASE_PROJECT_REF].supabase.co/functions/v1/auth-me"`
  - **Critério:** Retorna um JSON com os dados do usuário `{"user": {"id": "...", "username": "..."}}`.

#### Chaves de API
- [ ] **POST `/keys` (salvar):**
  - `curl -X POST -H "Content-Type: application/json" -H "Cookie: user-session=[USER_SESSION_COOKIE]" -d '{"geminiApiKey": "TEST_KEY"}' "https://[SUPABASE_PROJECT_REF].supabase.co/functions/v1/keys"`
  - **Critério:** Retorna `200 OK` com `{"message": "API keys saved successfully."}`.

#### Geração de Conteúdo
- [ ] **POST `/generate-content` (Forja):**
  - `curl -X POST -H "Content-Type: application/json" -H "Cookie: user-session=[USER_SESSION_COOKIE]" -d '{"filters": {"category": "Arma", ...}, "promptModifier": "uma espada amaldiçoada"}' "https://[SUPABASE_PROJECT_REF].supabase.co/functions/v1/generate-content"`
  - **Critério:** Retorna `200 OK` com um objeto JSON representando o item gerado, validado contra o schema de `types.ts`.

### Validação de Frontend e Design

- [ ] **Layout Visual:** O layout renderizado em `/index.html` é visualmente idêntico (diferença de pixels < 3%) ao design original.
- [ ] **Responsividade:** A aplicação continua funcional e esteticamente agradável em resoluções mobile, tablet e desktop.
- [ ] **Navegação:** A troca entre abas (`Forja`, `Conflitos`, etc.) funciona corretamente e atualiza a URL (se aplicável) e o conteúdo da view.
- [ ] **Interatividade:** Todos os botões, modais, sliders e inputs estão funcionais.
- [ ] **Fluxo de Login:** O botão "Entrar com Discord" redireciona para a autorização do Discord e, após sucesso, o frontend exibe o perfil do usuário.
- [ ] **Geração de Itens:** Clicar em "Forjar Lenda" exibe o estado de carregamento e, em seguida, renderiza o novo card de item, que pode ser selecionado para abrir o painel de detalhes.

### Validação de Banco de Dados (Turso)

- [ ] **Schema:** Após o primeiro deploy de uma função que usa o DB, as tabelas `creations`, `master_tool_history`, e `master_chat_history` existem no console do Turso.
- [ ] **Inserção de Dados:** Uma geração de conteúdo bem-sucedida insere uma nova linha na tabela `creations`.
- [ ] **Leitura de Dados:** O histórico do usuário é carregado corretamente da tabela `creations` ao fazer login.
