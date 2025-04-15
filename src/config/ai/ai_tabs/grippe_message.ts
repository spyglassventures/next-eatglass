import examplesData from '../sidebar_examples/grippe_sidebar_config.json';
import rawInitialMessages from '../ai_context/grippe_message.json';

export const warning_msg = 'Closed-Beta Test: Schlüsselinhalte anklicken ➜ Grippeverordnung erhalten';

export const followupBtn = ['mehr Argumente', 'eloquenter formulieren', 'übersetze in Englisch'];

export const inputCloudBtn = {
    Demografie: [
        "männlich Pat.",
        "weiblich Pat"
    ],
    Symptome: [
        "Grippaler Infekt",
        "Husten",
        "Fieber",
        "Halsschmerzen",
        "Gliederschmerzen",
        "Schüttelfrost",
        "Sinusitis",
        "Kopfschmerzen",
        "Abgeschlagenheit",
        "Nasennebenhöhlenentzündung"
    ],
    Dauer: [
        "seit 1 Tag",
        "seit 2 Tage",
        "seit wenigen Tagen",
        "seit 3 Tage",
        "seit 4 Tage",
        "seit 5 Tage",
        "seit 1 Woche",
        "seit 2 Wochen",
    ],

    Untersuchung: [
        "körperliche Untersuchung",
        "Hinweis auf Sinusitis",
        "Hinweis viralen Infekt",
        "Hinweis auf bakterielle Infektion",
        "Hinweis auf Allergie",
        "Hinweis auf Bronchitis",
        "Hinweis auf Pneumonie",
    ],

    Beschreibung: [
        "Ohr Untersuchung",
        "Rachen Untersuchung",
        "Lunge Untersuchung",
        "Nasen Untersuchung",
        "unauffällig",
        "blande/TFgeröter",
        "oral gerötet, bis leicht rosig",
        "Hinweis auf Nasennebenhöhlen",
        "Beteiligung",
        "Lunge frei",
        "kein exnthem",
        "oropharyngeal gerötet",
        "leicht gerötetes Trommelfell",
    ],

    Labor: [
        "Labor - leichter Leukozytose",
        "Labor - CRP von: []",
        "Labor - HBa1C von: [] ",
        "CRP leicht erhöht",
        "Temperatur: []°C",
        "Sauerstoffsättigung: []%"
    ],

    Krankmeldung: [
        "KM für 3 Tage",
        "KM für 5 Tage",
        "KM für 7 Tage"

    ],

    Wiedervorstellung: [
        "WV bei Verschlechterung",
        "WV bei Fieber > 39°C",
        "WV bei Atemnot",
        "WV bei Bewusstseinsveränderung",
        "WV bei anhaltendem Husten",
        "WV bei anhaltenden Halsschmerzen"
    ],



    Wirkstoffe: [
        "Paracetamol",
        "Ibuprofen",
        "Nasenspray (Xylometazolin)",
        "Schmerzmittel",
        "Antibiotikum bei bakterieller Sinusitis",
        "Hausmittel wie Inhalation"
    ],
    Medis: [
        "Dafalgan",
        "Irfen",
        "Nasivin",
        "Sinupret",
        "NeoCitran",
        "Otrivin",
        "Bettruhe empfohlen"
    ],
    Dringlichkeit: [
        "Atemnot",
        "anhaltendes hohes Fieber",
        "Bewusstseinsveränderung",
        "anhaltender starker Husten",
        "Symptome > 7 Tage",
        "Keine akuten Symptome"
    ],
    Begleiterkrankungen: [
        "Asthma",
        "COPD",
        "Diabetes",
        "Schwangerschaft",
        "Herzkrankheit",
        "Immunschwäche"
    ],
    Lebensumstände: [
        "Kindergarten-/Schulbesuch",
        "Pflegeheimkontakt",
        "Reisetätigkeit",
        "enge Familienkontakte mit Grippe",
        "beruflicher Kontakt zu vielen Menschen"
    ],

    Verlauf: [
        "konservatives Vorgehen empfohlen",
        "Analgesie",
        "körperliche Schonung",
        "ausreichend Flüssigkeit",
        "schleimlösende Medikation",
        "Krankmeldung für 3 Tage",
        "Wiedervorstellung bei Verschlechterung"
    ]
};

export const placeHolderInput = ['Symptome, Alter, Geschlecht, Medikamentenname, bekannte Diagnosen...'];

export { examplesData, rawInitialMessages };
