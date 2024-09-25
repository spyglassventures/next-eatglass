export interface DocumentInfo {
    partnerart: string;
    details: { label: string; value: string; type: 'text' | 'password' | 'url'; copyable?: boolean }[];
}

const documents: DocumentInfo[] = [
    {
        partnerart: 'GLN Dr. Christoph Berg',
        details: [
            { label: 'Nummer', value: '7601007461295', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'GLN Hausarztpraxis Buchs AG',
        details: [
            { label: 'Nummer', value: '7601002146425', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'GLN Labor (Qualab)',
        details: [
            { label: 'Nummer', value: '7601001772595', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'ZSR Nummer Praxis',
        details: [
            { label: 'Nummer', value: '1280017', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'UBS Kontoverbindung',
        details: [
            { label: 'Inhaber', value: 'Hausarztpraxis Buchs AG', type: 'text', copyable: true },
            { label: 'IBAN', value: 'CH72 0020 6206 1514 6201 J', type: 'text', copyable: true },
            { label: 'BIC', value: 'UBSWCHZH80A', type: 'text', copyable: true },
            { label: 'QR IBAN', value: 'CH233000520615146201J', type: 'text', copyable: true },
            { label: 'Bank', value: 'UBS AG, Postfach, 8098 Zürich', type: 'text', copyable: true }
        ],
    },
    {
        partnerart: 'Kontakt Vermieter',
        details: [
            { label: 'Vermieter', value: 'Rohner Robert und Elisabeth (-Würth)', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Kappelistrasse 5\n9470 Buchs SG', type: 'text', copyable: true },
            { label: 'Tel', value: 'unbekannt', type: 'text', copyable: true },
            { label: 'Natel', value: 'unbekannt', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'unbekannt', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'SVA St.Gallen',
        details: [
            { label: 'Nummer', value: 'R91.713', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'SwissLife',
        details: [
            { label: 'Nummer', value: '15DEA8', type: 'text', copyable: true },
        ],
    },

    {
        partnerart: 'Galexis',
        details: [
            { label: 'Kundennummer', value: '123456', type: 'text', copyable: true },
            { label: 'Url', value: 'https://www.e-galexis.com/de/login.php', type: 'url', copyable: true },



        ],
    },
    {
        partnerart: 'Polymed',
        details: [
            { label: 'Kundennummer', value: '123456', type: 'text', copyable: true },
            { label: 'Url', value: 'https://polyeasy.polymed.ch/', type: 'url', copyable: true },
        ],
    },
    {
        partnerart: 'Gesundeprodukte',
        details: [
            { label: 'Benutzername', value: 'praxiskappelihof@hin.ch', type: 'text', copyable: true },
            { label: 'Password', value: 'Noch nicht nutzbar. Sorry', type: 'password' },
            { label: 'URL', value: 'https://www.gesundeprodukte.ch', type: 'url', copyable: true }

        ],
    },
    {
        partnerart: 'Compendium',
        details: [
            { label: 'Benutzername', value: 'praxiskappelihof@hin.ch', type: 'text', copyable: true },
            { label: 'URL', value: 'https://compendium.ch/', type: 'url', copyable: true }

        ],
    },
];

export default documents;
