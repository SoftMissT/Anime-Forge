// lib/client/promptUtils.ts

/**
 * Cleans up common artifacts in AI-generated image prompts.
 * This includes collapsing whitespace, normalizing comma spacing, and trimming.
 * @param prompt - The raw prompt string.
 * @returns A cleaned and optimized prompt string.
 */
export const cleanImagePrompt = (prompt: string): string => {
    if (!prompt) return '';
    let cleaned = prompt;
    // Collapse multiple spaces, newlines, tabs into a single space
    cleaned = cleaned.replace(/[\s\n\r\t]+/g, ' ').trim();
    // Remove spaces before commas
    cleaned = cleaned.replace(/\s,/g, ',');
    // Ensure a single space after commas, but not if it's the end of the string
    cleaned = cleaned.replace(/,(\S)/g, ', $1');
    // Collapse multiple commas into one
    cleaned = cleaned.replace(/,+/g, ',');
    // Remove leading or trailing commas and whitespace
    cleaned = cleaned.trim().replace(/^,|,$/g, '').trim();
    return cleaned;
};