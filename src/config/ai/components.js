// src/config/ai/components.js
// shows which AI components are shown into src/intern/ClientPage.tsx
// see also src/config/ai/imports.js

// CAVE: also add to src/config/ai/imports.js


// new items also need to be added to case statements at the bottom of this file
import InternalDocuments from '@/components/IntInternalDocuments'; //
import Wissensdatenbank from '@/components/IntWissensdatenbank'; //
import DocNumbers from '@/components/IntDocNumbers'; //
import Vertrauensaerzte from '@/components/IntVertrauensaerzte'; //
import Aemtiplan from '@/components/IntAemtliplan'; // 
import Zahlungen from '@/components/IntZahlungseingaenge'; // 
import Welcome from '@/components/IntWelcomeMessage/Welcome';
import components from '@/config/ai/imports';
import Lieferengpass from '@/components/IntDrugshortage'; // 
import Translate from '@/components/IntTranslate'; //
import Konfigurationsanleitung from '@/components/IntKonfigurationsanleitung'; //
import LernvideosPage from '@/components/IntLernvideos'; //
import HIN from '@/components/IntHIN'; //
import QM from '@/components/IntQM'; //
import Materialauswertung from '@/components/IntMaterialauswertung'; //
import Tardoc from '@/components/IntTardoc'; //
import Abrechnung from '@/components/IntAbrechnung'; //
import QR from '@/components/IntQR'; //
import ChatWithPdf from '@/components/ChatWithPdf'; //
import Logs from '@/components/IntLogs'; //
import Dermatologie from '@/components/IntDermatologie'; //


// import CHDT from '@/components/MedienCHDT'; // nein da kein AI chat, nicht hier drin
import Diktat from '@/components/MedienDiktat'; //
import Cal from '@/components/IntCal'; //
import StammdatenIGM from '@/components/IntStammdatenIGM'; //
import mcsged from '@/components/ManagedCare/SGED'; //
import mcdiabetesscore from '@/components/ManagedCare/DiabetesScore'; //
// 



// NAME in NAVIGATION // NEVER HAVE SAME ITEM IN MULTIPLE DROPDOWNS
export const NAV_ITEMS = {
    mainComponents: [
        { key: 'diagnose', name: 'Differentialdiagnosen', visible_mpa: false, visible_arzt: true, visible_pro: true },
        { key: 'kostengutsprache', name: 'Kostengutsprache', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'literatur', name: 'Literatur', visible_mpa: false, visible_arzt: true, visible_pro: true },
        { key: 'reise', name: 'Reiseberatung', visible_mpa: true, visible_arzt: false, visible_pro: false },
        { key: 'freitext', name: 'Freitext', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'image', name: 'Bild (Upload)', visible_mpa: true, visible_arzt: false, visible_pro: false },
        { key: 'ernaehrung', name: 'Ernährungsempfehlung', visible_mpa: true, visible_arzt: false, visible_pro: true },
        { key: 'HIN', name: 'HIN Teilnehmer Suche', visible_mpa: false, visible_arzt: true, visible_pro: false },
    ],

    toolsDropdown: [
        { key: 'stellungsnahme', name: 'Stellungsnahme', visible_mpa: false, visible_arzt: true, visible_pro: true },
        { key: 'triage', name: 'Triage', visible_mpa: true, visible_arzt: false, visible_pro: true },
        { key: 'literatur', name: 'Literatur', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'medis', name: 'Medikamente', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'reise', name: 'Reiseberatung', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'ernaehrung', name: 'Ernährungsempfehlung', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'mediausland', name: 'Auslandsmedikation', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'ueberweisung', name: 'Überweisung Facharzt', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'verordnung', name: 'Verordnung', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'verhaltensempfehlung', name: 'Verhaltensempfehlung', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'ncp_assessment', name: 'NCP Assessment', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'ncp_diagnose', name: 'NCP Ernährungsdiagnose (PES)', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'ncp_intervention', name: 'NCP Interventionsplan', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'ncp_monitoring', name: 'NCP Monitoring- und Evaluation', visible_mpa: true, visible_arzt: true, visible_pro: true },


    ], // Medien KI 
    summariesDropdown: [
        { key: 'image', name: 'Bild (Upload)', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'chdt', name: 'Mundart -> Schriftdeutsch', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'antwortemail', name: 'Antwortemail', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'antwortemail_split', name: 'Antwortemail (geteilt)', visible_mpa: false, visible_arzt: false, visible_pro: true },
    ],

    // Managed Care KI aka Module in Entwicklung
    mangedCareDropdown: [
        { key: 'mcsged', name: 'SGED', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'mcdiabetesscore', name: 'Diabetes Risiko', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'Diktat', name: 'Diktat', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'verlaufsoptimierer', name: 'Verlaufsoptimierer', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'documents', name: 'Dokumente', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'pdf', name: 'PDF', visible_mpa: false, visible_arzt: true, visible_pro: true },
        { key: 'Wissensdatenbank', name: 'Wissensdatenbank', visible_mpa: false, visible_arzt: true, visible_pro: true },
        { key: 'Aemtiplan', name: 'Ämtiplan', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'Zahlungen', name: 'Zahlungseingänge', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'Lieferengpass', name: 'Lieferengpass', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'QM', name: 'QM - in Arbeit', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'Abrechnung', name: 'Abrechnung - in Arbeit', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'Cal', name: 'Kalendereinträge', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'StammdatenIGM', name: 'Medi und MiGel Datei', visible_mpa: true, visible_arzt: false, visible_pro: true },
        { key: 'Logs', name: 'Letzte KI Anfragen', visible_mpa: false, visible_arzt: false, visible_pro: false },
        { key: 'ueberweisungV2', name: 'Überweisung Facharzt V2 - coming soon', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'calculator', name: 'Rechner', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'labor', name: 'Laborwerte', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'ekg', name: 'EKG', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'bd_24', name: '24h BD Befunden', visible_mpa: false, visible_arzt: false, visible_pro: true },
        



    ],


    // KI Formulare
    formsDropdown: [
        { key: 'az_jugendliche', name: 'AZ Jugendliche', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'ktg_erstbericht', name: 'KTG Erstbericht', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'sva_aerztlicher_bericht_eingliederung', name: 'SVA Bericht Eingliederung', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'sva_berufliche_integration', name: 'SVA Berufliche Integration', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'sva_verlaufsbericht', name: 'SVA Verlaufsbericht', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'zwischenbericht_kvg_ktg', name: 'Zwischenbericht KVG ', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'zwischenbericht_uvg_unfall', name: 'Zwischenbericht UVG', visible_mpa: true, visible_arzt: true, visible_pro: true },
        // { key: 'ktg_2_phasen', name: 'Entitäten extrahieren', visible_mpa: false, visible_arzt: false, visible_pro: false },
        // { key: 'diagnosen_extract', name: 'Diagnosen extrahieren', visible_mpa: false, visible_arzt: false, visible_pro: false },
        // { key: 'group_blocks', name: 'Verlauf gruppieren', visible_mpa: false, visible_arzt: false, visible_pro: false },
        { key: 'ktg_2_phasen', name: 'Entitäten extrahieren', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'diagnosen_extract', name: 'Diagnosen extrahieren', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'group_blocks', name: 'Verlauf gruppieren', visible_mpa: false, visible_arzt: false, visible_pro: true },
    ],


    freitextDropdown: [ // 1 item is required
        { key: 'freitext', name: 'Freitext', visible_mpa: true, visible_arzt: true, visible_pro: true },


    ],

    interneDropdown: [ // adjust to change name in Naviation
        { key: 'InternalDocument', name: 'Interne Dokumente', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'DocNumbers', name: 'Dokumenten-Nummern', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'Vertrauensaerzte', name: 'Vertrauensärzte', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'Translate', name: 'Übersetzung (DeepL)', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'HIN', name: 'HIN Teilnehmer Suche', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'Konfigurationsanleitung', name: 'Konfigurationsanleitung', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'LernvideosPage', name: 'Lernvideos', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'Welcome', name: 'Willkommen - Hier starten', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'QR', name: 'QR Codes', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'Logs', name: 'Letzte KI Anfragen', visible_mpa: false, visible_arzt: false, visible_pro: false },
        { key: 'ChatWithPdf', name: 'ChatWithPdf', visible_mpa: false, visible_arzt: false, visible_pro: true },
        { key: 'Tardoc', name: 'TARDOC', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'Materialauswertung', name: 'Materialauswertung', visible_mpa: true, visible_arzt: true, visible_pro: true },
        { key: 'Dermatologie', name: 'Dermatologie', visible_mpa: true, visible_arzt: true, visible_pro: true },

        // { key: 'antwortemail', name: 'antwortemail', visible_mpa: false, visible_arzt: true, visible_pro: true }

        // no comma ! in last item
    ]
};


// turned off as long no partners booked feature
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
    Cog6ToothIcon,          // GlobeAsiaAustraliaIcon // Import for Translate
    PlayIcon,               // Import for LernvideosPage
    HeartIcon,              // For QM
    AcademicCapIcon,        // For HIN+
    CheckBadgeIcon,      // For Abrechnung
    ArrowRightEndOnRectangleIcon, // Vertrauensarzt


} from '@heroicons/react/24/solid';


// NAME in Header Page, just below the menu
export const COMPONENTS = {
    diagnose: {                         // key from NAV_ITEMS
        name: 'Differentialdiagnosen', // Name in Header Page, below grey navigation, free form
        component: 'Chat_diagnose',
        buttonText: 'Diagnose'
    },
    triage: {
        name: 'Triage',
        component: 'Chat_triage',
        buttonText: 'Triage'
    },
    ekg: {
        name: 'Langzeit-EKG (Holter-EKG, R-Test)',
        component: 'Chat_ekg',
        buttonText: 'EKG'
    },
    bd_24: {
        name: '24-Stunden Blutdruckmessung',
        component: 'Chat_24_BD',
        buttonText: '24 BD'
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

    ncp_assessment: {
        name: 'NCP Assessment',
        component: 'Chat_ncp_assessment',
        buttonText: 'NCP Assessment'
    },

    ncp_diagnose: {
        name: 'NCP Diagnose (PES)',
        component: 'Chat_ncp_diagnose',
        buttonText: 'NCP Ernährungsdiagnose (PES)'
    },

    ncp_intervention: {
        name: 'NCP Interventionsplan',
        component: 'Chat_ncp_intervention',
        buttonText: 'NCP Interventionsplan'
    },

    ncp_monitoring: {
        name: 'NCP Monitoring- und Evaluation',
        component: 'Chat_ncp_monitoring',
        buttonText: 'NCP Monitoring- und Evaluation'
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
    antwortmail: {
        name: 'Antwortmail',
        component: 'Chat_antwortmail',
        buttonText: 'Antwortmail'
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
    antwortemail: {
        name: 'Antwortemail',
        component: 'Chat_antwortemail',
        buttonText: 'Antwortemail'
    },
    antwortemail_split: {
        name: 'Antwortemail (geteilt)',
        component: 'Chat_antwortemail_split',
        buttonText: 'Antwortemail (geteilt)'
    },
    verlaufsoptimierer: {
        name: 'Verlaufsoptimierer',
        component: 'Chat_verlaufsoptimierer',
        buttonText: 'Verlaufsoptimierer'
    },
    image: {
        name: 'Bild (Upload)',
        component: 'Chat_image',
        buttonText: 'Bild (Upload)'
    },
    chdt: {
        name: 'Mundart -> Schriftdeutsch',
        component: 'Chat_chdt',
        buttonText: 'CHDT'
    },

    Diktat: {
        name: 'Diktat',
        component: 'Chat_Diktat',
        buttonText: 'Diktat'
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
    },
    Wissensdatenbank: {
        name: 'Wissensdatenbank',
        component: 'Chat_knowledge',
        buttonText: 'Wissensdatenbank'
    },

    // KI FORMS
    ktg_erstbericht: {
        name: 'KTG Erstbericht',
        component: 'Chat_KI_FORMS_ktg_erstbericht',
        buttonText: 'ktg_erstbericht'
    },
    az_jugendliche: {
        name: 'AZ Jugendliche',
        component: 'Chat_KI_FORMS_AZ_Jugendliche',
        buttonText: 'az_jugendliche'
    },
    sva_aerztlicher_bericht_eingliederung: {
        name: 'SVA Ärztlicher Bericht Eingliederung',
        component: 'chat_KI_FORMS_sva_aerztlicher_bericht_eingliederung',
        buttonText: 'sva_aerztlicher_bericht_eingliederung'
    },
    sva_berufliche_integration: {
        name: 'SVA Berufliche Integration',
        component: 'Chat_KI_FORMS_sva_berufliche_integration',
        buttonText: 'sva_berufliche_integration'
    },
    sva_verlaufsbericht: {
        name: 'SVA Verlaufsbericht',
        component: 'Chat_KI_FORMS_sva_verlaufsbericht',
        buttonText: 'sva_verlaufsbericht'
    },
    zwischenbericht_kvg_ktg: {
        name: 'Zwischenbericht KVG',
        component: 'Chat_KI_FORMS_Zwischenbericht_kvg_ktg',
        buttonText: 'zwischenbericht_kvg_ktg'
    },
    zwischenbericht_uvg_unfall: { // key
        name: 'Zwischenbericht UVG',
        component: 'Chat_KI_FORMS_Zwischenbericht_uvg_unfall',
        buttonText: 'zwischenbericht_uvg_unfall' // key
    },

    // Structured Response
    ktg_2_phasen: {
        name: 'Entitäten extrahieren (Namen, Personen, Firmen, ...)',
        component: 'Chat_KI_FORMS_ktg_2_phasen',
        buttonText: 'ktg_2_phasen'
    },
    diagnosen_extract: {
        name: 'Diagnosen extrahieren',
        component: 'Chat_STRUC_diagnosen_extract',
        buttonText: 'diagnosen_extract'
    },
    group_blocks: {
        name: 'Verlauf gruppieren',
        component: 'Chat_STRUC_group_blocks',
        buttonText: 'group_blocks'
    },

    // add non KI components, i.e. interne Dokumente here to make available in magic menu
    InternalDocument: {
        name: 'Internal Document',
        component: 'InternalDocuments',
        buttonText: 'Internal Document'
    },

    Wissensdatenbank: {
        name: 'Wissensdatenbank',
        component: 'Wissensdatenbank',
        buttonText: 'wissensdatenbank'
    },
    DocNumbers: {
        name: 'Doc Numbers',
        component: 'DocNumbers',
        buttonText: 'doc_numbers'
    },
    Vertrauensaerzte: {
        name: 'Vertrauensärzte',
        component: 'Vertrauensaerzte',
        buttonText: 'vertrauensaerzte'
    },
    Aemtiplan: {
        name: 'Ämtiplan',
        component: 'Aemtiplan',
        buttonText: 'aemtiplan'
    },
    Zahlungen: {
        name: 'Zahlungen',
        component: 'Zahlungen',
        buttonText: 'zahlungen'
    },
    Welcome: {
        name: 'Welcome',
        component: 'Welcome',
        buttonText: 'welcome'
    },
    Lieferengpass: {
        name: 'Lieferengpass',
        component: 'Lieferengpass',
        buttonText: 'lieferengpass'
    },
    Translate: {
        name: 'Translate',
        component: 'Translate',
        buttonText: 'translate'
    },
    Konfigurationsanleitung: {
        name: 'Konfigurationsanleitung',
        component: 'Konfigurationsanleitung',
        buttonText: 'konfigurationsanleitung'
    },
    LernvideosPage: {
        name: 'Lernvideos',
        component: 'LernvideosPage',
        buttonText: 'lernvideos'
    },
    HIN: {
        name: 'HIN',
        component: 'HIN',
        buttonText: 'hin'
    },
    QM: {
        name: 'QM',
        component: 'QM',
        buttonText: 'qm'
    },
    Materialauswertung: {
        name: 'Materialauswertung',
        component: 'Materialauswertung',
        buttonText: 'Materialauswertung'
    },
    Tardoc: {
        name: 'Tardoc',
        component: 'Tardoc',
        buttonText: 'Tardoc'
    },
    QR: {
        name: 'QR',
        component: 'QR',
        buttonText: 'qr'
    },
    Dermatologie: {
        name: 'Dermatologie',
        component: 'Dermatologie',
        buttonText: 'Dermatologie'
    },
    ChatWithPdf: {
        name: 'Chat mit PDF',
        component: 'ChatWithPdf',
        buttonText: 'chat_with_pdf'
    },
    Diktat: {
        name: 'Diktat',
        component: 'Diktat',
        buttonText: 'diktat'
    },
    Cal: {
        name: 'Kalender',
        component: 'Cal',
        buttonText: 'cal'
    },
    StammdatenIGM: {
        name: 'Stammdaten IGM',
        component: 'StammdatenIGM',
        buttonText: 'stammdaten_igm'
    },
    Antwortemail: {
        name: 'Antwort-E-Mail',
        component: 'Antwortemail',
        buttonText: 'antwortemail'
    },
    Antwortemail_split: {
        name: 'Antwort-E-Mail (Split)',
        component: 'Antwortemail_split',
        buttonText: 'antwortemail_split'
    },
    Abrechnung: {
        name: 'Abrechnung',
        component: 'Abrechnung',
        buttonText: 'abrechnung'
    },
    mcsged: {
        name: 'MCS-GED',
        component: 'mcsged',
        buttonText: 'mcsged'
    },
    mcdiabetesscore: {
        name: 'MC Diabetes Score',
        component: 'mcdiabetesscore',
        buttonText: 'mcdiabetesscore'
    }




};

export const ICONS = {
    stellungsnahme: DocumentTextIcon,
    labor: BeakerIcon,
    literatur: BookOpenIcon,
    medis: BriefcaseIcon,
    triage: SparklesIcon,
    calculator: CalculatorIcon,
    reise: GlobeAltIcon,
    freitext: PencilIcon,
    ernaehrung: PencilIcon,
    mediausland: GlobeAsiaAustraliaIcon,
    ueberweisung: ArrowDownRightIcon,
    ueberweisungV2: ArrowDownRightIcon,
    verordnung: HomeModernIcon,
    verhaltensempfehlung: FaceSmileIcon,
    InternalDocument: DocumentDuplicateIcon,
    Wissensdatenbank: BookOpenIcon,
    DocNumbers: HashtagIcon,
    Vertrauensaerzte: ArrowRightEndOnRectangleIcon,
    Aemtiplan: CalendarIcon,
    Zahlungen: CreditCardIcon,
    Welcome: SparklesIcon,
    Lieferengpass: ExclamationTriangleIcon,
    Translate: GlobeAsiaAustraliaIcon,
    Konfigurationsanleitung: Cog6ToothIcon,
    LernvideosPage: PlayIcon,
    HIN: AcademicCapIcon,
    Logs: AcademicCapIcon,
    QM: BookOpenIcon,
    Materialauswertung: PencilIcon,
    Tardoc: HeartIcon,
    ChatWithPdf: DocumentTextIcon,
    Abrechnung: CheckBadgeIcon,
    QR: CheckBadgeIcon,
    // CHDT: CheckBadgeIcon,
    Diktat: CheckBadgeIcon,
    Cal: CalendarIcon,
    StammdatenIGM: PencilIcon,
    // antwortmail: CheckBadgeIcon,
    // verlaufsoptimierer: CheckBadgeIcon
    mcsged: AcademicCapIcon,
    mcdiabetesscore: AcademicCapIcon,
    Dermatologie: AcademicCapIcon,



};

// not required
// export const GROUPS = {
//     mainComponents: ['diagnose', 'kostengutsprache', 'medis', 'labor'],
//     toolsDropdown: ['stellungsnahme', 'triage', 'labor', 'literatur', 'medis', 'calculator', 'reise', 'ernaehrung', 'mediausland', 'ueberweisung', 'ueberweisungV2', 'verordnung', 'verhaltensempfehlung', 'ahviv', 'ktg_erstbericht', 'sva_berufliche_integration', 'versicherungsanfrage'],
//     summariesDropdown: ['documents', 'pdf', 'image', 'verlaufsoptimierer', 'antwortmail', 'chdt'],
//     freitextDropdown: ['freitext'],

// };

// F O R  I N T E R N A L   C O M P O N E N T S

// also adjust Components in /src/app/intern/ClientPage.tsx approx line 168
export const getActiveComponent = (activeComponent) => {
    switch (activeComponent) {
        case 'InternalDocument':
            return InternalDocuments;
        case 'Wissensdatenbank':
            return Wissensdatenbank;
        case 'DocNumbers':
            return DocNumbers; // Ensure this maps to the correct component
        case 'Vertrauensaerzte':
            return Vertrauensaerzte; // Ensure this maps to the correct component
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
        case 'HIN':
            return HIN;
        case 'Logs':
            return Logs;
        case 'QM':
            return QM;
        case 'Materialauswertung':
            return Materialauswertung;
        case 'Tardoc':
            return Tardoc;
        case 'QR':
            return QR;
        case 'ChatWithPdf':
            return ChatWithPdf;
        case 'Diktat':
            return Diktat;
        case 'Cal':
            return Cal;
        case 'StammdatenIGM':
            return StammdatenIGM;
        // case 'CHDT':
        //     return CHDT; // no its an AI component
        case 'Antwortemail':
            return Antwortemail;
        case 'Antwortemail_split':
            return Antwortemail_split;
        case 'Abrechnung':
            return Abrechnung;
        case 'mcsged':
            return mcsged;
        case 'mcdiabetesscore':
            return mcdiabetesscore;
        case 'Dermatologie':
            return Dermatologie;



        default:
            return components[COMPONENTS[activeComponent]?.component];
    }
};