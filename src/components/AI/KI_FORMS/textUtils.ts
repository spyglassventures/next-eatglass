// utils/textUtils.ts

export const countTokens = (text: string) => {
    return text.split(/\s+/).filter(Boolean).length;
};

export const getTokenStatus = (tokens: number) => {
    if (tokens > 5000) {
        return { color: 'text-red-600', message: 'Zu viele Wörter', icon: 'FaTimesCircle' };
    } else if (tokens > 3500) {
        return { color: 'text-orange-300', message: 'Eventuell zu viele Wörter', icon: 'FaExclamationTriangle' };
    } else {
        return { color: 'text-green-600', message: 'Eingabe gut' };
    }
};
