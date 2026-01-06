// lib/server/turso.ts
import { createClient } from '@libsql/client';

// FIX: Module '"@libsql/client"' declares 'Client' locally, but it is not exported.
// The Client type is inferred from the return type of createClient to resolve the import error.
type Client = ReturnType<typeof createClient>;

let initializationPromise: Promise<Client> | null = null;

async function createAndInitializeClient(): Promise<Client> {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        throw new Error('As variáveis de ambiente do Turso (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN) não estão configuradas.');
    }

    const client = createClient({ url, authToken });
    console.log('Cliente Turso criado. Inicializando tabelas...');

    try {
        await client.batch([
            `CREATE TABLE IF NOT EXISTS creations (
                id TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                is_favorite BOOLEAN DEFAULT FALSE,
                content TEXT NOT NULL
            );`,
            `CREATE TABLE IF NOT EXISTS master_tool_history (
                id TEXT PRIMARY KEY,
                userId TEXT NOT NULL,
                createdAt TEXT NOT NULL,
                userInput TEXT NOT NULL,
                aiOutput TEXT NOT NULL
            );`,
            `CREATE TABLE IF NOT EXISTS master_chat_history (
                userId TEXT PRIMARY KEY,
                history TEXT NOT NULL,
                updatedAt TEXT NOT NULL
            );`
        ], 'write');
        console.log("Banco de dados Turso inicializado (tabelas verificadas/criadas).");
        return client;
    } catch (e: any) {
        console.error("Falha ao inicializar as tabelas do Turso:", e.message);
        throw new Error(`Falha ao inicializar o banco de dados: ${e.message}`);
    }
}

export function getTursoClient(): Promise<Client> {
    if (!initializationPromise) {
        initializationPromise = createAndInitializeClient();
    }
    return initializationPromise;
}