import { FaBroom, FaClipboard, FaVials, FaPrescriptionBottleAlt, FaTasks, FaBriefcaseMedical } from 'react-icons/fa'; // Import icons from react-icons

export const categories = ['Reinigung', 'Administration', 'Labor', 'Apotheke', 'Qualitätsmanagement'];

export const categoryIcons = {
    Reinigung: FaBroom,
    Administration: FaClipboard,
    Labor: FaVials,
    Apotheke: FaPrescriptionBottleAlt,
    Qualitätsmanagement: FaTasks,
};

export const persons = ['Rahel', 'Karin', 'Eliza', 'Ledi', 'Angela'];

export const timePeriods = [
    { value: 'week', label: 'Woche' },
    { value: 'month', label: 'Monat' },
    { value: 'quarter', label: 'Quartal' },
    { value: 'half-year', label: 'Halbjahr' }
];

const duties = [
    // Administration
    {
        category: 'Administration',
        duty: 'Wöchentliche Abrechnungen sowie Jahresabrechnung',
        person: 'Rahel',
        deputy: 'Karin',
        frequency: 'week',
        interval: 1,
        priority: 'high',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Durchführung wöchentlicher und jährlicher Abrechnungen.', type: 'text' },
        ],
    },
    {
        category: 'Administration',
        duty: 'Abrechnung Gardasil Impfungen',
        person: 'Rahel',
        deputy: 'Eliza',
        frequency: 'month',
        interval: 1,
        priority: 'medium',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Verantwortlich für die Abrechnung von Gardasil Impfungen.', type: 'text' },
        ],
    },
    {
        category: 'Administration',
        duty: 'Bestellung Büromaterial',
        person: 'Rahel',
        deputy: 'Eliza',
        frequency: 'month',
        interval: 1,
        priority: 'medium',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Bestellung von Büromaterialien.', type: 'text' },
        ],
    },
    {
        category: 'Administration',
        duty: 'Kassabuch führen',
        person: 'Karin',
        deputy: 'Eliza',
        frequency: 'week',
        interval: 1,
        priority: 'high',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Pflege des Kassabuchs.', type: 'text' },
        ],
    },
    {
        category: 'Administration',
        duty: 'Stundenblätter verwalten',
        person: 'Rahel',
        deputy: 'Eliza',
        frequency: 'month',
        interval: 1,
        priority: 'medium',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Verwaltung der Stundenblätter.', type: 'text' },
        ],
    },
    // Labor
    {
        category: 'Labor',
        duty: 'Bestellung Labormaterial',
        person: 'Rahel',
        deputy: 'Karin',
        frequency: 'month',
        interval: 1,
        priority: 'high',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Bestellung von Labormaterialien.', type: 'text' },
        ],
    },
    {
        category: 'Labor',
        duty: 'QK Labor',
        person: 'Rahel',
        deputy: 'Karin',
        frequency: 'month',
        interval: 1,
        priority: 'high',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Qualitätskontrolle im Labor.', type: 'text' },
        ],
    },
    // Reinigung
    {
        category: 'Reinigung',
        duty: 'Kartonnage',
        person: 'Angela',
        deputy: 'Ledi',
        frequency: 'week',
        interval: 1,
        priority: 'low',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Verpackung und Entsorgung von Karton.', type: 'text' },
        ],
    },
    {
        category: 'Reinigung',
        duty: 'Aufräumen, Arbeitsplatz',
        person: 'Eliza',
        deputy: 'Ledi',
        frequency: 'week',
        interval: 1,
        priority: 'low',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Regelmäßiges Aufräumen und Reinigen des Arbeitsplatzes.', type: 'text' },
        ],
    },
    {
        category: 'Reinigung',
        duty: 'Einkaufen Kleinigkeiten (Batterien, Lampen...)',
        person: 'Ledi',
        deputy: 'Angela',
        frequency: 'month',
        interval: 1,
        priority: 'low',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Einkauf von Kleinigkeiten wie Batterien und Lampen.', type: 'text' },
        ],
    },
    // Apotheke
    {
        category: 'Apotheke',
        duty: 'Medikamente beim Galiphone verschicken (nach 17.30 Uhr)',
        person: 'Rahel',
        deputy: 'Karin',
        frequency: 'week',
        interval: 1,
        priority: 'high',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Versand von Medikamenten beim Galiphone nach 17:30 Uhr.', type: 'text' },
        ],
    },
    {
        category: 'Apotheke',
        duty: 'BTM-Kontrolle',
        person: 'Rahel',
        deputy: 'Karin',
        frequency: 'week',
        interval: 1,
        priority: 'high',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Kontrolle von Betäubungsmitteln (BTM).', type: 'text' },
        ],
    },
    {
        category: 'Apotheke',
        duty: 'Notfallrucksack mit Ampullen Tasche',
        person: 'Rahel',
        deputy: 'Karin',
        frequency: 'week',
        interval: 1,
        priority: 'high',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Überprüfung und Nachfüllen des Notfallrucksacks.', type: 'text' },
        ],
    },
    {
        category: 'Apotheke',
        duty: 'Sterilisation der Geräte (Steri)',
        person: 'Rahel',
        deputy: 'Eliza',
        frequency: 'week',
        interval: 1,
        priority: 'high',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Sterilisation der medizinischen Geräte.', type: 'text' },
        ],
    },
    {
        category: 'Apotheke',
        duty: 'Bestellung bei gesundeprodukte.ch',
        person: 'Rahel',
        deputy: 'Eliza',
        frequency: 'month',
        interval: 1,
        priority: 'medium',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Bestellung von Produkten bei gesundeprodukte.ch.', type: 'text' },
        ],
    },
    // Qualitätsmanagement
    {
        category: 'Qualitätsmanagement',
        duty: 'Qualitätsmanagement durchführen',
        person: 'Rahel',
        deputy: 'Eliza',
        frequency: 'quarter',
        interval: 1,
        priority: 'high',
        startDate: '01.01.2024',
        endDate: '31.12.2024',
        details: [
            { label: 'Beschreibung', value: 'Durchführung von Maßnahmen zur Qualitätskontrolle und -sicherung.', type: 'text' },
        ],
    },
];

export default duties;
