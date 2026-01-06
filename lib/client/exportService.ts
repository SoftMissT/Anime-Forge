// lib/client/exportService.ts
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
