// lib/googleSheets.ts
import { google } from 'googleapis';
import type { User } from '../types';

// Function to get authenticated Google Sheets client
const getSheetsClient = () => {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

    if (!privateKey || !clientEmail) {
        console.error('Google Sheets API credentials are not set in environment variables.');
        return null;
    }

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: clientEmail,
            private_key: privateKey.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
};

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const WHITELIST_SHEET_NAME = 'discord_id';

/**
 * Checks if a user's Discord ID is in the whitelist spreadsheet.
 * @param userId - The Discord ID of the user to check.
 * @returns A promise that resolves to true if the user is whitelisted, false otherwise.
 */
export const isUserWhitelisted = async (userId: string): Promise<boolean> => {
    try {
        const sheets = getSheetsClient();
        if (!sheets || !SPREADSHEET_ID) {
            console.error('Google Sheets client or Spreadsheet ID is not configured.');
            throw new Error("A configuração da planilha do Google para verificação de acesso não foi encontrada no servidor.");
        }

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            // FIX: Changed range from B:B to A:A to match the specification for Discord ID column.
            range: `${WHITELIST_SHEET_NAME}!A:A`,
        });

        const rows = response.data.values;
        if (rows) {
            // Flatten array of arrays and check for inclusion, skipping the header row.
            return rows.slice(1).flat().some(whitelistedId => whitelistedId === userId);
        }

        return false;
    } catch (error: any) {
        console.error('Error checking whitelist:', error);
        if (error.message.includes('Unable to parse range')) {
             throw new Error(`Ocorreu um erro ao verificar la permissão de acesso. Detalhes: A aba da planilha com o nome "${WHITELIST_SHEET_NAME}" não foi encontrada. Verifique se a planilha foi configurada conforme o README.`);
        }
        throw new Error(`Ocorreu um erro ao verificar la permissão de acesso. Detalhes: ${error.message}`);
    }
};
