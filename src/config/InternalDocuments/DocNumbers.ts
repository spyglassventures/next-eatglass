export interface DocumentInfo {
    partnerart: string;
    details: { label: string; value: string; type: 'text' | 'password' | 'url'; copyable?: boolean }[];
}

const documents: DocumentInfo[] = [
    {
        partnerart: 'GLN Dr. Mustername',
        details: [
            { label: 'Nummer', value: '7601000000001', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'GLN Musterpraxis AG',
        details: [
            { label: 'Nummer', value: '7601000000002', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'GLN Musterlabor (Qualab)',
        details: [
            { label: 'Nummer', value: '7601000000003', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'ZSR Nummer Musterpraxis',
        details: [
            { label: 'Nummer', value: '9999999', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'UBS Kontoverbindung Musterpraxis',
        details: [
            { label: 'Inhaber', value: 'Musterpraxis AG', type: 'text', copyable: true },
            { label: 'IBAN', value: 'CH00 0020 0000 0000 0000 A', type: 'text', copyable: true },
            { label: 'BIC', value: 'UBSWCHZH00A', type: 'text', copyable: true },
            { label: 'QR IBAN', value: 'CH000000000000000000A', type: 'text', copyable: true },
            { label: 'Bank', value: 'UBS AG, Musteradresse, 8000 Zürich', type: 'text', copyable: true }
        ],
    },
    {
        partnerart: 'Kontakt Vermieter',
        details: [
            { label: 'Vermieter', value: 'Mustervermieter AG', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Musterstrasse 1\n8000 Zürich', type: 'text', copyable: true },
            { label: 'Tel', value: 'unbekannt', type: 'text', copyable: true },
            { label: 'Natel', value: 'unbekannt', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'unbekannt', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'SVA Musterstadt',
        details: [
            { label: 'Nummer', value: 'R91.999', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'SwissLife Musterkunden',
        details: [
            { label: 'Nummer', value: '15DEA9', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Musterlieferant Galexis',
        details: [
            { label: 'Kundennummer', value: '123456', type: 'text', copyable: true },
            { label: 'Url', value: 'https://www.e-galexis.com/de/login.php', type: 'url', copyable: true },
        ],
    },
    {
        partnerart: 'Musterlieferant Polymed',
        details: [
            { label: 'Kundennummer', value: '654321', type: 'text', copyable: true },
            { label: 'Url', value: 'https://polyeasy.polymed.ch/', type: 'url', copyable: true },
        ],
    },
    {
        partnerart: 'Musterprodukte',
        details: [
            { label: 'Benutzername', value: 'musterpraxis@hin.ch', type: 'text', copyable: true },
            { label: 'Password', value: 'Noch nicht nutzbar. Sorry', type: 'password' },
            { label: 'URL', value: 'https://www.gesundeprodukte.ch', type: 'url', copyable: true },
        ],
    },
    {
        partnerart: 'Compendium Musterdatenbank',
        details: [
            { label: 'Benutzername', value: 'musterpraxis@hin.ch', type: 'text', copyable: true },
            { label: 'URL', value: 'https://compendium.ch/', type: 'url', copyable: true },
        ],
    },
];

export default documents;
