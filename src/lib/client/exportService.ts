// lib/client/exportService.ts
import type { GeneratedItem, Category, FavoriteItem, HistoryItem, User } from "../../types";

// Categorias que se encaixam em "personagens"
const CHARACTER_CATEGORIES: Category[] = ['Caçador', 'NPC', 'Inimigo/Oni'];
const TECHNIQUE_CATEGORIES: Category[] = ['Respiração', 'Kekkijutsu'];
const LOCATION_CATEGORIES: Category[] = ['Local/Cenário', 'Evento', 'Mitologia', 'História Antiga'];
const ITEM_CATEGORIES: Category[] = ['Arma', 'Acessório'];

// Função para filtrar o histórico da forja por um conjunto de categorias
const filterForgeHistory = (history: GeneratedItem[], categories: Category[]): GeneratedItem[] => {
    return history.filter(item => categories.includes(item.categoria));
};

const createExportPayload = (history: HistoryItem[], favorites: FavoriteItem[]) => {
    return {
        metadata: {
            export_date: new Date().toISOString(),
            app_version: "Kimetsu Forge v2.0",
        },
        items: filterForgeHistory(history, ITEM_CATEGORIES),
        characters: filterForgeHistory(history, CHARACTER_CATEGORIES),
        techniques: filterForgeHistory(history, TECHNIQUE_CATEGORIES),
        locations: filterForgeHistory(history, LOCATION_CATEGORIES),
        conflicts: history.filter(item => item.categoria === 'Guerra de Clãs'),
        missions: history.filter(item => item.categoria === 'Missões'),
        favorites: favorites,
    };
};

export const exportDataToFirebase = async (history: HistoryItem[], favorites: FavoriteItem[], user: User) => {
    const exportData = createExportPayload(history, favorites);

    const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User': JSON.stringify(user),
        },
        body: JSON.stringify({ exportData }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao enviar exportação para o servidor.');
    }

    return await response.json();
};

export const exportDataToGoogleDocs = async (history: HistoryItem[], favorites: FavoriteItem[], user: User) => {
    const response = await fetch('/api/exportToGoogleDocs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User': JSON.stringify(user),
        },
        body: JSON.stringify({ history, favorites }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao exportar para o Google Docs.');
    }

    return await response.json();
};