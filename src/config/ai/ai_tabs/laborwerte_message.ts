import examplesData from '../sidebar_examples/laborwerte_sidebar_config.json';
import rawInitialMessages from '../ai_context/laborwerte_message.json';

export const warning_msg = 'Closed-Beta Test: Inhalt klicken statt Eingabemaske ausfüller ➜ Laborparameter zur Diskussion erhalten (Recherche)';

export const followupBtn = ['Normwerte LDL', 'Normbereich CRP', 'tiefere Recherche'];

export const inputCloudBtn = {
    Demografie: [
        "männlich Pat.",
        "weiblich Pat.",
        "Alter: jünger als 10",
        "Alter: 10-20",
        "Alter: 20-30",
        "Alter: 30-40",
        "Alter: 40-50",
        "Alter: 50-60",
        "Alter: 60-70",
        "Alter: 70-80",
        "Alter: >80",
        "Alter: []"
    ],
    Symptome: [
        "Müdigkeit",
        "Fieber",
        "Husten",
        "Halsschmerzen",
        "Brustschmerzen",
        "Kurzatmigkeit",
        "Beinschmerzen",
        "Ödeme",
        "Bauchschmerzen",
        "Übelkeit/Erbrechen",
        "Gewichtsverlust",
        "Schüttelfrost",
        "Gliederschmerzen",
        "Sinusitis",
        "Kopfschmerzen",
        "Abgeschlagenheit"
    ],
    Verdachtsdiagnosen: [
        "Infekt / Grippaler Infekt",
        "Anämie",
        "Herzinfarkt-Verdacht",
        "Thrombose/Lungenembolie-Verdacht",
        "Lebererkrankung",
        "Nierenerkrankung",
        "Diabetes",
        "Entzündliche Erkrankung",
        "Tumordiagnostik",
        "Schilddrüsenerkrankung",
        "Rheuma-Verdacht",
        "Knochenerkrankung (z.B. Osteoporose)"
    ],
    Bekannte_Vorerkrankungen: [
        "Diabetes mellitus",
        "Hypertonie",
        "Chronische Niereninsuffizienz",
        "Leberzirrhose",
        "Koronare Herzkrankheit",
        "Autoimmunerkrankung",
        "Tumorerkrankung",
        "Rheumatoide Arthritis",
        "Schwangerschaft",
        "[] sonstige Vorerkrankungen"
    ],
    Medikamente: [
        "aktive Medis: []",
        "Blutverdünner",
        "Cholesterinsenker",
        "Immunsuppressiva",
        "Kortison",
        "Diabetesmedikamente",
        "Schilddrüsenmedikamente",
        "Sonstige Medikamente: []"
    ],
    Routine_oder_Notfall: [
        "Routineuntersuchung",
        "Notfalluntersuchung"
    ],
    Wunschprofile: [
        "Standardlabor intern (BB, CRP, BSG, BZ, Elektrolyte)",
        "Erweitertes Labor intern (inkl. Leber-, Nierenprofil)",
        "Speziallabor extern (z.B. Vitamine, Rheumaabklärung)",
        "Präventiv-Check (Basislabor + Vitamine + Tumormarker)"
    ],
    Externe_Untersuchungen: [
        "Externe Spezialuntersuchungen gewünscht: Ja",
        "Externe Spezialuntersuchungen gewünscht: Nein"
    ]

};

export const placeHolderInput = ['Alter, Symptome, Vorerkrankungen, Medis, Profile, ...'];

export { examplesData, rawInitialMessages };
