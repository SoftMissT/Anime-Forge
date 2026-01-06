// pages/api/exportToGoogleDocs.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import type { docs_v1 } from 'googleapis';
import type { User, GeneratedItem, FavoriteItem, HistoryItem } from '../../types';
import { buildPlainTextForItem } from '../../lib/textFormatters';

const getDocsClient = () => {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

    if (!privateKey || !clientEmail) {
        throw new Error("As credenciais da Conta de Serviço do Google não estão configuradas.");
    }

    const auth = new google.auth.GoogleAuth({
        credentials: { client_email: clientEmail, private_key: privateKey },
        scopes: ['https://www.googleapis.com/auth/documents'],
    });

    return google.docs({ version: 'v1', auth });
};

const formatCreationsForDocs = (history: HistoryItem[], favorites: FavoriteItem[]) => {
    const requests: docs_v1.Schema$Request[] = [];
    let currentIndex = 1;

    const insertText = (text: string, style?: docs_v1.Schema$TextStyle) => {
        requests.push({ insertText: { location: { index: currentIndex }, text } });
        if (style) {
            requests.push({ updateTextStyle: { range: { startIndex: currentIndex, endIndex: currentIndex + text.length }, textStyle: style, fields: '*' } });
        }
        currentIndex += text.length;
    };
    
    const applyHeading = (level: 'HEADING_1' | 'HEADING_2' | 'HEADING_3') => {
        requests.push({ updateParagraphStyle: { range: { startIndex: currentIndex - 1, endIndex: currentIndex }, paragraphStyle: { namedStyleType: level }, fields: 'namedStyleType' } });
    };

    const insertSection = (title: string, items: GeneratedItem[]) => {
        if (items.length === 0) return;
        
        insertText(`\n${title}\n`);
        applyHeading('HEADING_1');

        items.forEach(item => {
            const isFavorite = favorites.some(fav => fav.id === item.id);
            const titleText = `${isFavorite ? '⭐ ' : ''}${item.nome}\n`;
            insertText(titleText);
            applyHeading('HEADING_2');
            
            const plainText = buildPlainTextForItem(item).replace(`Nome: ${item.nome}\n`, ''); // Remove name as it's the title
            insertText(`${plainText}\n\n`);
        });
    };

    const docTitle = `Kimetsu Forge - Exportação (${new Date().toLocaleDateString('pt-BR')})\n`;
    insertText(docTitle);
    requests.push({ updateParagraphStyle: { range: { startIndex: 1, endIndex: docTitle.length }, paragraphStyle: { namedStyleType: 'TITLE' }, fields: 'namedStyleType' } });

    insertSection('Favoritos', favorites);
    insertSection('Histórico Completo', history);
    
    return requests;
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const userHeader = req.headers['x-user'];
    if (!userHeader || typeof userHeader !== 'string') {
        return res.status(401).json({ message: 'Autenticação de usuário é necessária.' });
    }

    try {
        const user: User = JSON.parse(userHeader);
        const { history, favorites } = req.body;
        const docs = getDocsClient();

        // 1. Create a new document
        const createResponse = await docs.documents.create({
            requestBody: {
                title: `Kimetsu Forge - Exportação de ${user.username}`,
            },
        });
        
        const documentId = createResponse.data.documentId;
        if (!documentId) {
            throw new Error('Não foi possível criar o Google Doc.');
        }

        // 2. Format the content
        const requests = formatCreationsForDocs(history, favorites);
        
        // 3. Update the document with the formatted content
        if (requests.length > 0) {
            await docs.documents.batchUpdate({
                documentId,
                requestBody: {
                    requests,
                },
            });
        }
        
        const docUrl = `https://docs.google.com/document/d/${documentId}/edit`;
        res.status(200).json({ message: 'Documento criado com sucesso!', url: docUrl });

    } catch (error: any) {
        console.error('Google Docs API error:', error);
        res.status(500).json({ message: 'Falha ao exportar para o Google Docs.', details: error.message });
    }
}