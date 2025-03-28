// Example: app/utils/textUtils.ts or directly in page.tsx
export const stripHtml = (html: string | null): string => {
    if (!html) return '';
    if (typeof window !== 'undefined') { // Browser environment
        try {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.textContent || div.innerText || '';
        } catch (e) {
            console.error("DOM parsing for stripHtml failed, using regex fallback:", e);
            return html.replace(/<[^>]*>/g, ''); // Regex fallback
        }
    } else { // Non-browser environment
        return html.replace(/<[^>]*>/g, ''); // Regex fallback
    }
};