export interface DocumentInfo {
    partnerart: string;
    details: { label: string; value: string; type: 'text' | 'password' | 'url'; copyable?: boolean }[];
}

const documents: DocumentInfo[] = [
    {
        partnerart: 'CSS',
        details: [
            { label: 'Empfänger', value: 'CSS Versicherung', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Tribschenstrasse 21, Postfach 2568, 6002 Luzern', type: 'text', copyable: true },
            { label: 'Tel', value: '058 277 13 30', type: 'text', copyable: true },
            { label: 'Fax', value: '058 277 90 10', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'avd.d@css.ch', type: 'text', copyable: true },
        ],
    },
   {
    partnerart: 'Aquilana',
    details: [
        { label: 'Empfänger', value: 'Aquilana', type: 'text', copyable: true },
        { label: 'Adresse', value: 'Bruggerstrasse 46, 5400 Baden', type: 'text', copyable: true },
        { label: 'Tel', value: '056 203 44 44', type: 'text', copyable: true },
        { label: 'E-Mail', value: 'vad@aquilana.ch', type: 'text', copyable: true }
    ],
},
    {
    partnerart: 'Sympany',
    details: [
        { label: 'Krankenkasse', value: 'Sympany', type: 'text', copyable: true },
        { label: 'Adresse', value: 'Peter Merian-Weg 2, 4002 Basel', type: 'text', copyable: true },
        { label: 'Tel', value: '058 262 40 70', type: 'text', copyable: true },
        { label: 'Fax', value: '058 262 42 97', type: 'text', copyable: true },
        { label: 'E-Mail', value: 'vertrauensaerztlicher-dienst@sympany.ch', type: 'text', copyable: true }
    ]
},
{
    partnerart: 'SUPRA',
    details: [
        { label: 'Krankenkasse', value: 'SUPRA', type: 'text', copyable: true },
        { label: 'Adresse', value: 'Postfach 680, 1919 Martigny', type: 'text', copyable: true },
        { label: 'Tel', value: '0848 803 333', type: 'text', copyable: true },
        { label: 'E-Mail', value: 'medizinischer-dienst@groupemutuel.ch', type: 'text', copyable: true }
    ]
},
{
    partnerart: 'Einsiedler Krankenkasse',
    details: [
        { label: 'Krankenkasse', value: 'Einsiedler Krankenkasse', type: 'text', copyable: true },
        { label: 'Adresse', value: 'Postfach 57, 8840 Einsiedeln', type: 'text', copyable: true },
        { label: 'Tel', value: '055 418 07 41', type: 'text', copyable: true },
        { label: 'E-Mail', value: 'kkeinsiedeln@hin.ch', type: 'text', copyable: true }
    ]
},
{
    partnerart: 'SWICA',
    details: [
        { label: 'Krankenkasse', value: 'SWICA', type: 'text', copyable: true },
        { label: 'Adresse', value: 'Postfach 900, 8901 Urdorf', type: 'text', copyable: true },
        { label: 'Tel', value: '052 244 22 33', type: 'text', copyable: true },
        { label: 'E-Mail', value: 'vad@swica.ch', type: 'text', copyable: true },
        { label: 'E-Mail 2', value: 'reha.vad@swica.ch', type: 'text', copyable: true }
    ]
},
{
    partnerart: 'Krankenkasse Steffisburg',
    details: [
        { label: 'Krankenkasse', value: 'Krankenkasse Steffisburg', type: 'text', copyable: true },
        { label: 'Adresse', value: 'Postfach 297, 3612 Steffisburg', type: 'text', copyable: true },
        { label: 'Tel', value: '033 439 40 20', type: 'text', copyable: true },
        { label: 'E-Mail', value: 'kkst@hin.ch', type: 'text', copyable: true }
    ]
},
{
    partnerart: 'CONCORDIA',
    details: [
        { label: 'Krankenkasse', value: 'CONCORDIA', type: 'text', copyable: true },
        { label: 'Adresse', value: 'Bundesplatz 15, 6002 Luzern', type: 'text', copyable: true },
        { label: 'Tel', value: '041 228 16 14', type: 'text', copyable: true },
        { label: 'E-Mail', value: 'vertrauensarzt@concordia.ch', type: 'text', copyable: true }
    ],
},

   {
    partnerart: 'Sympany',
    details: [
        { label: 'Krankenkasse', value: 'Sympany', type: 'text', copyable: true },
        { label: 'Adresse', value: 'Peter Merian-Weg 2, 4002 Basel', type: 'text', copyable: true },
        { label: 'Tel', value: '058 262 40 70', type: 'text', copyable: true },
        { label: 'Fax', value: '058 262 42 97', type: 'text', copyable: true },
        { label: 'E-Mail', value: 'vertrauensaerztlicher-dienst@sympany.ch', type: 'text', copyable: true }
    ]
},
{
    partnerart: 'SUPRA',
    details: [
        { label: 'Krankenkasse', value: 'SUPRA', type: 'text', copyable: true },
        { label: 'Adresse', value: 'Postfach 680, 1919 Martigny', type: 'text', copyable: true },
        { label: 'Tel', value: '0848 803 333', type: 'text', copyable: true },
        { label: 'E-Mail', value: 'medizinischer-dienst@groupemutuel.ch', type: 'text', copyable: true }
    ]
},
{
    partnerart: 'Einsiedler Krankenkasse',
    details: [
        { label: 'Krankenkasse', value: 'Einsiedler Krankenkasse', type: 'text', copyable: true },
        { label: 'Adresse', value: 'Postfach 57, 8840 Einsiedeln', type: 'text', copyable: true },
        { label: 'Tel', value: '055 418 07 41', type: 'text', copyable: true },
        { label: 'E-Mail', value: 'kkeinsiedeln@hin.ch', type: 'text', copyable: true }
    ]
},
{
    partnerart: 'SWICA',
    details: [
        { label: 'Krankenkasse', value: 'SWICA', type: 'text', copyable: true },
        { label: 'Adresse', value: 'Postfach 900, 8901 Urdorf', type: 'text', copyable: true },
        { label: 'Tel', value: '052 244 22 33', type: 'text', copyable: true },
        { label: 'E-Mail', value: 'vad@swica.ch', type: 'text', copyable: true },
        { label: 'E-Mail 2', value: 'reha.vad@swica.ch', type: 'text', copyable: true }
    ]
},
{
    partnerart: 'Krankenkasse Steffisburg',
    details: [
        { label: 'Krankenkasse', value: 'Krankenkasse Steffisburg', type: 'text', copyable: true },
        { label: 'Adresse', value: 'Postfach 297, 3612 Steffisburg', type: 'text', copyable: true },
        { label: 'Tel', value: '033 439 40 20', type: 'text', copyable: true },
        { label: 'E-Mail', value: 'kkst@hin.ch', type: 'text', copyable: true }
    ]
},
{
    partnerart: 'CONCORDIA',
    details: [
        { label: 'Krankenkasse', value: 'CONCORDIA', type: 'text', copyable: true },
        { label: 'Adresse', value: 'Bundesplatz 15, 6002 Luzern', type: 'text', copyable: true },
        { label: 'Tel', value: '041 228 16 14', type: 'text', copyable: true },
        { label: 'E-Mail', value: 'vertrauensarzt@concordia.ch', type: 'text', copyable: true }
    ]
},
    {
        partnerart: 'HOTELA',
        details: [
            { label: 'Empfänger', value: 'Hotela', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Rue de la Gare 18, 1820 Montreux', type: 'text', copyable: true },
            { label: 'Tel', value: '021 962 49 49', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'hotela@hin.ch', type: 'text', copyable: true },
        ],
    }
];

export default documents;
