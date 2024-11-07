// Utility function to sanitize the filename and replace umlauts
export const sanitizeFileNameImport = (name: string) => {
    return name
        .replace(/[äÄ]/g, 'ae')
        .replace(/[öÖ]/g, 'oe')
        .replace(/[üÜ]/g, 'ue')
        .replace(/[ß]/g, 'ss')
        .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
        .replace(/\s+/g, '_');
};

// Utility function to sanitize VCF fields (removes commas and trims spaces)
export const sanitizeVCFField = (field: string | undefined) => {
    return field ? field.replace(/,+/g, '').trim() : '';
};

// Utility function to map language codes to readable languages
export const mapLanguageCode = (code: string | undefined) => {
    switch (code) {
        case 'DES': return 'Deutsch';
        case 'FRS': return 'Französisch';
        case 'ENG': return 'Englisch';
        case 'ITA': return 'Italienisch';
        default: return 'Keine Information';
    }
};

// Utility function to get flag icon for language codes
export const getLanguageFlag = (code: string | undefined) => {
    switch (code) {
        case 'DES': return '🇨🇭 / 🇩🇪 ';
        case 'FRS': return '🇫🇷 ';
        case 'ENG': return '🇬🇧 ';
        case 'ITA': return '🇮🇹 ';
        default: return 'Keine Information';
    }
};
