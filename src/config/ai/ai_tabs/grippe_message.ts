import examplesData from '../sidebar_examples/grippe_sidebar_config.json';
import rawInitialMessages from '../ai_context/grippe_message.json';

export const warning_msg = 'Closed-Beta Test: Schlüsselinhalte anklicken ➜ Grippeverordnung erhalten';

export const followupBtn = ['mehr Argumente', 'eloquenter formulieren', 'übersetze in Englisch'];

// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    Demografie: [
        "0-1 Jahre, Säugling",
        "1-3 Jahre, Kleinkind",
        "4-10 Jahre alt",
        "11-18 Jahre alt",
        "19-50 Jahre alt",
        "51-70 Jahre alt",
        "über 70 Jahre",
        "männlich",
        "weiblich"
    ],
    Symptome: [
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
    ]
};

export const placeHolderInput = ['Symptome, Alter, Geschlecht, Medikamentenname, bekannte Diagnosen...'];

export { examplesData, rawInitialMessages };
