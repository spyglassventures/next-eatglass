/**
 * Erzeugt eine zufällige ID in der Form "abcd-efgh"
 */
export const generateId = (): string =>
    Math.random().toString(36).substring(2, 6) +
    '-' +
    Math.random().toString(36).substring(2, 6);
