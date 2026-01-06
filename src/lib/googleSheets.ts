
// src/lib/googleSheets.ts
// Este arquivo foi limpo para evitar erros de build no cliente.
// A verificação de whitelist foi desativada.

export const isUserWhitelisted = async (userId: string): Promise<boolean> => {
    return true; // Whitelist desativada, acesso liberado.
};

export const fetchWhitelist = async (): Promise<string[]> => {
    return [];
};
