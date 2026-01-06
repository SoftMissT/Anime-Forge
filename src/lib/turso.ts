import { createClient } from '@libsql/client';

const tursoUrl = process.env.NEXT_PUBLIC_TURSO_URL;
const tursoToken = process.env.NEXT_PUBLIC_TURSO_TOKEN;

if (!tursoUrl || !tursoToken) {
    console.warn("Variáveis de ambiente do Turso (NEXT_PUBLIC_TURSO_URL, NEXT_PUBLIC_TURSO_TOKEN) não estão definidas.");
}

export const turso = createClient({
  url: tursoUrl || 'libsql://dummy.turso.io',
  authToken: tursoToken || '',
});