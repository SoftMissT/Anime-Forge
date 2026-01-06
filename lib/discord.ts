// lib/discord.ts

export interface DiscordTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
}

export interface DiscordUser {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    global_name: string | null;
}

const API_ENDPOINT = 'https://discord.com/api/v10';

/**
 * Exchanges an authorization code for an access token from Discord's API.
 */
export async function exchangeCodeForToken(code: string): Promise<DiscordTokenResponse> {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('Variáveis de ambiente do Discord não estão configuradas.');
    }

    const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
    });

    const response = await fetch(`${API_ENDPOINT}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body,
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Discord token exchange failed:', errorData);
        
        let userFacingError = 'Falha ao trocar o código de autorização do Discord.';
        if (errorData.error === 'invalid_client') {
            userFacingError = 'Falha na autenticação: Client ID ou Client Secret do Discord inválido. O administrador precisa verificar as variáveis de ambiente no servidor.';
        } else if (errorData.error === 'invalid_grant') {
            userFacingError = 'Falha na autenticação: O código de autorização é inválido ou expirou. Por favor, tente fazer o login novamente.';
        }
        
        throw new Error(userFacingError);
    }

    return response.json();
}

/**
 * Fetches the user's profile from Discord's API using an access token.
 */
export async function getUserProfile(accessToken: string): Promise<DiscordUser> {
    const response = await fetch(`${API_ENDPOINT}/users/@me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch Discord user profile:', errorData);
        throw new Error('Falha ao obter o perfil do usuário do Discord.');
    }

    return response.json();
}

/**
 * Constructs the full URL for a user's avatar.
 */
export function constructAvatarUrl(userId: string, avatarHash: string | null): string {
    if (avatarHash) {
        const format = avatarHash.startsWith('a_') ? 'gif' : 'png';
        return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${format}?size=128`;
    }
    // Fallback to default Discord avatar
    return `https://cdn.discordapp.com/embed/avatars/0.png`;
}