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
            { label: 'Krankenkasse', value: 'Aquilana', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Bruggerstrasse 46, 5400 Baden', type: 'text', copyable: true },
            { label: 'Tel', value: '056 203 44 44', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad@aquilana.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Sympany',
        details: [
            { label: 'Krankenkasse', value: 'Sympany', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Peter Merian-Weg 2, 4002 Basel', type: 'text', copyable: true },
            { label: 'Tel', value: '058 262 40 70', type: 'text', copyable: true },
            { label: 'Fax', value: '058 262 42 97', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vertrauensaerztlicher-dienst@sympany.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'SUPRA',
        details: [
            { label: 'Krankenkasse', value: 'SUPRA', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 680, 1919 Martigny', type: 'text', copyable: true },
            { label: 'Tel', value: '0848 803 333', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'medizinischer-dienst@groupemutuel.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Einsiedler Krankenkasse',
        details: [
            { label: 'Krankenkasse', value: 'Einsiedler Krankenkasse', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 57, 8840 Einsiedeln', type: 'text', copyable: true },
            { label: 'Tel', value: '055 418 07 41', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'kkeinsiedeln@hin.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'SWICA',
        details: [
            { label: 'Krankenkasse', value: 'SWICA', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 900, 8901 Urdorf', type: 'text', copyable: true },
            { label: 'Tel', value: '052 244 22 33', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad@swica.ch', type: 'text', copyable: true },
            { label: 'E-Mail 2', value: 'reha.vad@swica.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Krankenkasse Steffisburg',
        details: [
            { label: 'Krankenkasse', value: 'Krankenkasse Steffisburg', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 297, 3612 Steffisburg', type: 'text', copyable: true },
            { label: 'Tel', value: '033 439 40 20', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'kkst@hin.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'CONCORDIA',
        details: [
            { label: 'Krankenkasse', value: 'Concordia', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Bundesplatz 15, 6002 Luzern', type: 'text', copyable: true },
            { label: 'Tel', value: '041 228 16 14', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vertrauensarzt@concordia.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Atupri',
        details: [
            { label: 'Empfänger', value: 'Atupri', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Zieglerstrasse 29, 3000 Bern 65', type: 'text', copyable: true },
            { label: 'Tel', value: '031 555 08 15', type: 'text', copyable: true },
            { label: 'Fax', value: '031 555 09 12', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad@atupri.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Avenir',
        details: [
            { label: 'Empfänger', value: 'Atupri', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 680, 1919 Martigny', type: 'text', copyable: true },
            { label: 'Tel', value: '0848 803 333', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'medizinischer-dienst@groupemutuel.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'KKLH',
        details: [
            { label: 'Empfänger', value: 'KKLH', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Luzernstrasse 19, 6144 Zell', type: 'text', copyable: true },
            { label: 'Tel', value: '041 989 70 00', type: 'text', copyable: true },
            { label: 'Fax', value: '041 989 70 01', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad@kklh.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'KPT',
        details: [
            { label: 'Krankenkasse', value: 'KPT', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach, 3001 Bern', type: 'text', copyable: true },
            { label: 'Tel', value: '058 310 99 10', type: 'text', copyable: true },
            { label: 'Fax', value: '058 310 83 34', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vakdeutschweiz@kpt.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'ÖKK',
        details: [
            { label: 'Empfänger', value: 'ÖKK', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Bahnhofstrasse 13, 7302 Landquart', type: 'text', copyable: true },
            { label: 'Tel', value: '058 456 10 15', type: 'text', copyable: true },
            { label: 'Fax', value: '058 456 10 14', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad@oekk.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Vivao Sympany',
        details: [
            { label: 'Empfänger', value: 'Vivao Sympany', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Peter Merian-Weg 2, 4002 Basel', type: 'text', copyable: true },
            { label: 'Tel', value: '058 262 40 70', type: 'text', copyable: true },
            { label: 'Fax', value: '058 262 42 97', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vertrauensaerztlicher-dienst@sympany.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Easy Sana',
        details: [
            { label: 'Krankenkasse', value: 'Easy Sana', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 680, 1919 Martigny', type: 'text', copyable: true },
            { label: 'Tel', value: '0848 803 333', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'medizinischer-dienst@groupemutuel.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'GLKV',
        details: [
            { label: 'Empfänger', value: 'GLKV', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Abläsch 8, Postfach, 8762 Schwanden', type: 'text', copyable: true },
            { label: 'Tel', value: '055 642 25 25', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad.glkv@hin.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'LUMNEZIANA',
        details: [
            { label: 'Empfänger', value: 'LUMNEZIA', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 22, 7144 Vella', type: 'text', copyable: true },
            { label: 'Tel', value: '081 931 35 35', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'lumneziana@hin.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'EGK',
        details: [
            { label: 'Empfänger', value: 'EGK', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Birspark 1, 4242 Laufen', type: 'text', copyable: true },
            { label: 'Tel', value: '061 765 51 11', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad@egk.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Sanavals RVK',
        details: [
            { label: 'Empfänger', value: 'Sanavals RVK', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Haldenstrasse 25, 6006 Luzern', type: 'text', copyable: true },
            { label: 'Tel', value: '041 417 05 15', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'sekretariat.mcp@rvk.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'SLKK',
        details: [
            { label: 'Empfänger', value: 'SLKK', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Hofwiesenstrasse 370, Postfach 5652, 8050 Zürich', type: 'text', copyable: true },
            { label: 'Tel', value: '044 368 70 56', type: 'text', copyable: true },
            { label: 'Fax', value: '044 368 70 58', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad.slkk@hin.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Sodalis RVK',
        details: [
            { label: 'Empfänger', value: 'RVK', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Haldenstrasse 25, 6006 Luzern', type: 'text', copyable: true },
            { label: 'Tel', value: '041 417 05 15', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'sekretariat.mcp@rvk.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'vita surselva',
        details: [
            { label: 'Empfänger', value: 'vita surselva', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 44, 7130 Ilanz', type: 'text', copyable: true },
            { label: 'Tel', value: '081 925 61 60', type: 'text', copyable: true },
            { label: 'Fax', value: '081 925 61 73', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vitasurselva.vad@hin.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'KK Visperterminen RVK',
        details: [
            { label: 'Krankenkasse', value: 'KK Visperterminen RVK', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Haldenstrasse 25, 6006 Luzern', type: 'text', copyable: true },
            { label: 'Tel', value: '041 417 05 15', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'sekretariat.mcp@rvk.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'CMVEO',
        details: [
            { label: 'Empfänger', value: 'CMVEO', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Place Centrale 5, 1937 Orsières', type: 'text', copyable: true },
            { label: 'Tel', value: '027 783 25 87', type: 'text', copyable: true },
            { label: 'Fax', value: '027 783 30 18', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'service-medical@groupemutuel.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Krankenkasse Institut Ingenbohl',
        details: [
            { label: 'Krankenkasse', value: 'Krankenkasse Institut Ingenbohl', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Kronenstrasse 19, Postfach 57, 8840 Einsiedeln', type: 'text', copyable: true },
            { label: 'Tel', value: '055 418 07 41', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'kkingenbohl@hin.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Krankenkasse Wädenswil',
        details: [
            { label: 'Krankenkasse', value: 'Krankenkasse Wädenswil', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Industriestrasse 15, 8820 Wädenswil', type: 'text', copyable: true },
            { label: 'Tel', value: '043 477 71 71', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad.kkwaedenswil@hin.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Krankenkasse Birchmeier',
        details: [
            { label: 'Krankenkasse', value: 'Krankenkasse Birchmeier', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Hauptstrasse 22, 5444 Künten', type: 'text', copyable: true },
            { label: 'Tel', value: '056 485 60 40', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'kkbirchmeier@hin.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Krankenkasse Stoffel, Mels',
        details: [
            { label: 'Krankenkasse', value: 'Krankenkasse Stoffel, Mels', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Im Zinggen 1, 8475 Ossingen', type: 'text', copyable: true },
            { label: 'Tel', value: '052 317 32 11', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'krankenkassestoffel@hin.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'SWICA',
        details: [
            { label: 'Krankenkasse', value: 'SWICA', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 900, 8901 Urdorf', type: 'text', copyable: true },
            { label: 'Tel', value: '052 244 22 33', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad@swica.ch', type: 'text', copyable: true },
            { label: 'E-Mail 2', value: 'reha.vad@swica.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Galenos',
        details: [
            { label: 'Empfänger', value: 'Galenos', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Weltpoststrasse 19, Postfach, 3000 Bern 16', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad@visana.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'rhenusana',
        details: [
            { label: 'Empfänger', value: 'rhenusana', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Widnauerstrasse 6, 9435 Heerbrugg', type: 'text', copyable: true },
            { label: 'Tel', value: '071 727 88 06', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'va-rhenusana@hin.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Mutuel',
        details: [
            { label: 'Krankenkasse', value: 'Mutuel', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 680, 1919 Martigny', type: 'text', copyable: true },
            { label: 'Tel', value: '0848 803 333', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'medizinischer-dienst@groupemutuel.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'AMB',
        details: [
            { label: 'Empfänger', value: 'AMB', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 680, 1919 Martigny', type: 'text', copyable: true },
            { label: 'Tel', value: '0848 803 333', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'medizinischer-dienst@groupemutuel.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Sanitas',
        details: [
            { label: 'Empfänger', value: 'Sanitas', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Servicecenter Aarau, Bahnhofstrasse 41, 5000 Aarau', type: 'text', copyable: true },
            { label: 'Tel', value: '062 837 53 53', type: 'text', copyable: true },
            { label: 'Fax', value: '062 837 54 72', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vadsanitas@sanitas.com', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Philos',
        details: [
            { label: 'Empfänger', value: 'Philos', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 680, 1919 Martigny', type: 'text', copyable: true },
            { label: 'Tel', value: '0848 803 333', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'medizinischer-dienst@groupemutuel.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Assura',
        details: [
            { label: 'Krankenkasse', value: 'Assura', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Case postale 7, 1052 Le Mont-sur-Lausanne', type: 'text', copyable: true },
            { label: 'Tel', value: '031 556 73 85', type: 'text', copyable: true },
            { label: 'Fax', value: '031 556 73 99', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'medizinischer-dienst@assura.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Visana',
        details: [
            { label: 'Krankenkasse', value: 'Visana', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 199, 3000 Bern 15', type: 'text', copyable: true },
            { label: 'Tel', value: '031 357 80 44', type: 'text', copyable: true },
            { label: 'Fax', value: '031 357 81 23', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad@visana.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Agrisano',
        details: [
            { label: 'Krankenkasse', value: 'Agrisano', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Laurstrasse 10, 5201 Brugg', type: 'text', copyable: true },
            { label: 'Tel', value: '056 461 71 11', type: 'text', copyable: true },
            { label: 'Fax', value: '056 461 71 08', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'info.vad@agrisano.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Helsana',
        details: [
            { label: 'Krankenkasse', value: 'Helsana', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Worblaufenstrasse 200, 3048 Worblaufen', type: 'text', copyable: true },
            { label: 'Tel', value: '058 340 37 61', type: 'text', copyable: true },
            { label: 'Fax', value: '058 340 00 59', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad.bern@helsana.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'sana24',
        details: [
            { label: 'Krankenkasse', value: 'sana24', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 199, 3000 Bern 15', type: 'text', copyable: true },
            { label: 'Tel', value: '031 357 80 44', type: 'text', copyable: true },
            { label: 'Fax', value: '031 357 81 23', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad@visana.ch', type: 'text', copyable: true },
        ],
    },


    {
        partnerart: 'vivacare',
        details: [
            { label: 'Empfänger', value: 'vivacare', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 199, 3000 Bern 15', type: 'text', copyable: true },
            { label: 'Tel', value: '031 357 80 44', type: 'text', copyable: true },
            { label: 'Fax', value: '031 357 81 23', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'vad@visana.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'Mutuelle Neuchâteloise',
        details: [
            { label: 'Empfänger', value: 'Mutuelle Neuchâteloise', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Postfach 680, 1919 Martigny', type: 'text', copyable: true },
            { label: 'Tel', value: '0848 803 333', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'medizinischer-dienst@groupemutuel.ch', type: 'text', copyable: true },
        ],
    },
    {
        partnerart: 'HOTELA',
        details: [
            { label: 'Emfpänger', value: 'HOTELA', type: 'text', copyable: true },
            { label: 'Adresse', value: 'Rue de la Gare 18, 1820 Montreux', type: 'text', copyable: true },
            { label: 'Tel', value: '021 962 49 49', type: 'text', copyable: true },
            { label: 'E-Mail', value: 'hotela@hin.ch', type: 'text', copyable: true },
        ],
    }
];

export default documents;
