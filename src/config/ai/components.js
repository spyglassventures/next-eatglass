// src/config/ai/components.js
// shows which AI components are shown into src/intern/ClientPage.tsx
// see also src/config/ai/imports.js
// changed: 6.8.24, Daniel Mueller, refactored
// edited: 13.8.24, Daniel Mueller, added Ernährungsberatung and restructure of chat general structure
// edited: 29.8.24, Daniel Mueller, Navi structure changed, Ticket Text added

// CAVE: also add to src/config/ai/imports.js


// NAME in NAVIGATION
export const NAV_ITEMS = {
    mainComponents: [
        { key: 'diagnose', name: 'Differentialdiagnosen', visible: true },
        { key: 'kostengutsprache', name: 'Kostengutsprache', visible: true },
        { key: 'medis', name: 'Medikamente', visible: true },
        { key: 'labor', name: 'Laborwerte', visible: false },
        { key: 'freitext', name: 'Freitext', visible: true },
    ],
    toolsDropdown: [
        { key: 'stellungsnahme', name: 'Stellungsnahme', visible: true },
        { key: 'labor', name: 'Laborwerte', visible: true },
        { key: 'literatur', name: 'Literatur', visible: true },
        { key: 'medis', name: 'Medikamente', visible: true },
        { key: 'calculator', name: 'Rechner', visible: true },
        { key: 'reise', name: 'Reiseberatung', visible: true },
        { key: 'ernaehrung', name: 'Ernährungsempfehlung', visible: true },
        { key: 'mediausland', name: 'Auslandsmedikation', visible: true },
        { key: 'ueberweisung', name: 'Überweisung Facharzt', visible: true },
        { key: 'ueberweisungV2', name: 'Überweisung Facharzt V2 - coming soon', visible: false },
        { key: 'verordnung', name: 'Verordnung', visible: true },
        { key: 'verhaltensempfehlung', name: 'Verhaltensempfehlung', visible: true },
        // { key: 'ahviv', name: 'AHV/IV 1 - coming soon', visible: true }, // FORM
        // { key: 'ktg_erstbericht', name: 'KTG Erstbericht', visible: true }, // FORM
        // { key: 'sva_berufliche_integration', name: 'SVA Berufliche Integration', visible: true }, // FORM
        // { key: 'versicherungsanfrage', name: 'Versicherungsanfrage - coming soon', visible: false }, // FORM
    ],
    summariesDropdown: [
        { key: 'documents', name: 'Dokumente', visible: true },
        { key: 'pdf', name: 'PDF', visible: true },
        { key: 'image', name: 'Bild (Upload)', visible: true },
    ],
    formsDropdown: [ // 1 item is required
        { key: 'ktg_erstbericht', name: 'KTG Erstbericht', visible: true },
        { key: 'sva_berufliche_integration', name: 'SVA Berufliche Integration', visible: true },
    ],

    freitextDropdown: [ // 1 item is required
        { key: 'freitext', name: 'Freitext', visible: true },
    ],
    interneDropdown: [ // adjust to change name in Naviation
        { key: 'InternalDocument', name: 'Interne Dokumente', visible: true },
        { key: 'DocNumbers', name: 'Dokumenten-Nummern', visible: true },
        { key: 'Aemtiplan', name: 'Ämtiplan', visible: true },
        { key: 'Zahlungen', name: 'Zahlungseingänge', visible: true },
        { key: 'Lieferengpass', name: 'Lieferengpass', visible: true },
        { key: 'Translate', name: 'Translate', visible: true },
        { key: 'Konfigurationsanleitung', name: 'Konfigurationsanleitung', visible: true },
        { key: 'LernvideosPage', name: 'Lernvideos', visible: true },
        { key: 'Welcome', name: 'Willkommen - Hier starten', visible: true },
    ]
};


export const tickerAd = (
    <>
        Partner News: Freie Plätze bei Laborkurs (Grundkurs Urinteststreifen, Refresher-Kurs Präanalytik, Aufbaukurs Urinstreifen). Jetzt buchen!{' '}
        <a href="https://www.laborteam.ch/kurse" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
            zum Kursangebot (Labor Team)
        </a>
    </>
);




import {
    DocumentTextIcon,
    BeakerIcon,
    BookOpenIcon,
    BriefcaseIcon,
    CalculatorIcon,
    GlobeAltIcon,
    PencilIcon,
    GlobeAsiaAustraliaIcon,
    ArrowDownRightIcon,
    HomeModernIcon,
    FaceSmileIcon,
    DocumentDuplicateIcon,  // Import for InternalDocuments
    HashtagIcon,            // Import for DocNumbers
    CalendarIcon,           // Import for Aemtiplan
    CreditCardIcon,          // Import for Zahlungen
    SparklesIcon,           // Import for Welcome
    ExclamationTriangleIcon,           // Import for Lieferengpass
    Cog6ToothIcon,  // GlobeAsiaAustraliaIcon // Import for Translate
    PlayIcon // Import for LernvideosPage

} from '@heroicons/react/24/solid';

import InternalDocuments from '@/components/IntInternalDocuments'; //
import DocNumbers from '@/components/IntDocNumbers'; //
import Aemtiplan from '@/components/IntAemtliplan'; // 
import Zahlungen from '@/components/IntZahlungseingaenge'; // 
import Welcome from '@/components/IntWelcomeMessage/Welcome';
import components from '@/config/ai/imports';
import Lieferengpass from '@/components/IntDrugshortage'; // 
import Translate from '@/components/IntTranslate'; //
import Konfigurationsanleitung from '@/components/IntKonfigurationsanleitung'; //
import LernvideosPage from '@/components/IntLernvideos'; //

// NAME in Title: name
export const COMPONENTS = {
    diagnose: {
        name: 'Differentialdiagnosen',
        component: 'Chat_diagnose',
        buttonText: 'Diagnose'
    },
    kostengutsprache: {
        name: 'Kostengutsprache',
        component: 'Chat_kostengutsprache',
        buttonText: 'Gutsprache'
    },
    ernaehrung: {
        name: 'Ernährungsempfehlung',
        component: 'Chat_ernaehrung',
        buttonText: 'Ernährung'
    },
    medis: {
        name: 'Medikamente',
        component: 'Chat_medis',
        buttonText: 'Medis'
    },
    labor: {
        name: 'Laborwerte',
        component: 'Chat_labor',
        buttonText: 'Labor'
    },
    stellungsnahme: {
        name: 'Stellungsnahme',
        component: 'Chat_stellungsnahme',
        buttonText: 'Stellungsnahme'
    },
    literatur: {
        name: 'Literatur',
        component: 'Chat_literatur',
        buttonText: 'Literatur'
    },
    calculator: {
        name: 'Rechner',
        component: 'Chat_calculator',
        buttonText: 'Rechner'
    },
    reise: {
        name: 'Reiseberatung',
        component: 'Chat_reise',
        buttonText: 'Reiseberatung'
    },
    mediausland: {
        name: 'Auslandsmedikation',
        component: 'Chat_mediausland',
        buttonText: 'Auslandsmedikation '
    },
    ueberweisung: {
        name: 'Überweisung Facharzt',
        component: 'Chat_ueberweisungfacharzt',
        buttonText: 'Überweisung Facharzt'
    },
    ueberweisungV2: {
        name: 'Überweisung Facharzt V2 - coming soon',
        component: 'Chat_ueberweisungfacharztV2',
        buttonText: 'Überweisung FacharztV2'
    },
    verordnung: {
        name: 'Verordnung',
        component: 'Chat_verordnung',
        buttonText: 'Verordnung'
    },
    verhaltensempfehlung: {
        name: 'Verhaltensempfehlung',
        component: 'Chat_verhaltensempfehlung',
        buttonText: 'Verhaltensempfehlung'
    },
    // ahviv: {
    //     name: 'AHV/IV Formular Hilfe',
    //     component: 'Chat_ahviv',
    //     buttonText: 'ahviv'
    // },
    ktg_erstbericht: {
        name: 'KTG Erstbericht',
        component: 'Chat_ktg_erstbericht',
        buttonText: 'ktg_erstbericht'
    },
    sva_berufliche_integration: {
        name: 'SVA Berufliche Integration',
        component: 'Chat_sva_berufliche_integration',
        buttonText: 'sva_berufliche_integration'
    },
    versicherungsanfrage: {
        name: 'Versicherungsanfrage Hilfe',
        component: 'Chat_versicherungsanfrage',
        buttonText: 'versicherungsanfrage'
    },
    documents: {
        name: 'Dokumente',
        component: 'Chat_documente',
        buttonText: 'Texte'
    },
    pdf: {
        name: 'PDF',
        component: 'Chat_pdf',
        buttonText: 'PDF (via URL)'
    },
    image: {
        name: 'Bild (Upload)',
        component: 'Chat_image',
        buttonText: 'Bild (Upload)'
    },
    freitext: {
        name: 'Freitext',
        component: 'Chat_freitext',
        buttonText: 'Freitext'
    },
    interne: {
        name: 'Interne Dokumente',
        component: 'Chat_interne',
        buttonText: 'Interne Dokumente'
    }
};

export const ICONS = {
    stellungsnahme: DocumentTextIcon,
    labor: BeakerIcon,
    literatur: BookOpenIcon,
    medis: BriefcaseIcon,
    calculator: CalculatorIcon,
    reise: GlobeAltIcon,
    freitext: PencilIcon,
    ernaehrung: PencilIcon,
    mediausland: GlobeAsiaAustraliaIcon,
    ueberweisung: ArrowDownRightIcon,
    ueberweisungV2: ArrowDownRightIcon,
    verordnung: HomeModernIcon,
    verhaltensempfehlung: FaceSmileIcon,
    // ahviv: DocumentDuplicateIcon, // FORM
    ktg_erstbericht: PencilIcon, // FORM
    sva_berufliche_integration: DocumentDuplicateIcon, // FORM
    versicherungsanfrage: DocumentDuplicateIcon, // FORM
    // Interne Dokumente
    InternalDocument: DocumentDuplicateIcon,
    DocNumbers: HashtagIcon,
    Aemtiplan: CalendarIcon,
    Zahlungen: CreditCardIcon,
    Welcome: SparklesIcon,
    Lieferengpass: ExclamationTriangleIcon,
    Translate: GlobeAsiaAustraliaIcon,
    Konfigurationsanleitung: Cog6ToothIcon,
    LernvideosPage: PlayIcon

};

export const GROUPS = {
    mainComponents: ['diagnose', 'kostengutsprache', 'medis', 'labor'],
    toolsDropdown: ['stellungsnahme', 'labor', 'literatur', 'medis', 'calculator', 'reise', 'ernaehrung', 'mediausland', 'ueberweisung', 'ueberweisungV2', 'verordnung', 'verhaltensempfehlung', 'ahviv', 'ktg_erstbericht', 'sva_berufliche_integration', 'versicherungsanfrage'],
    summariesDropdown: ['documents', 'pdf', 'image'],
    freitextDropdown: ['freitext'],
    formsDropdown: ['freitext'],
    // interneDropdown: ['interne'], // NOT USED
};


// also adjust Components in // /Users/danielmueller/dev/next-kappelihof/src/app/intern/ClientPage.tsx approx line 168
export const getActiveComponent = (activeComponent) => {
    switch (activeComponent) {
        case 'InternalDocument':
            return InternalDocuments;
        case 'DocNumbers':
            return DocNumbers; // Ensure this maps to the correct component
        case 'Aemtiplan':
            return Aemtiplan;
        case 'Zahlungen':
            return Zahlungen;
        case 'Welcome':
            return Welcome;
        case 'Lieferengpass':
            return Lieferengpass;
        case 'Translate':
            return Translate;
        case 'Konfigurationsanleitung':
            return Konfigurationsanleitung;
        case 'LernvideosPage':
            return LernvideosPage;
        default:
            return components[COMPONENTS[activeComponent]?.component];
    }
};