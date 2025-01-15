import examplesData from '../sidebar_examples/triage_sidebar_config.json';
import rawInitialMessages from '../ai_context/triage_message.json';

export const warning_msg = 'Closed-Beta Test: Symptome anklicken ➜ Triagierungsvorschläge erhalten';

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
    Allgemeine: [
        "Husten",
        "Schnupfen",
        "Fieber",
        "Kopfschmerzen",
        "Halsschmerzen",
        "Gliederschmerzen",
        "Schüttelfrost",
        "Übelkeit",
        "Heiserkeit"
    ],
    Dringlichkeit: [
        "Schmerz 9/10",
        "Plötzliche Atemnot",
        "Sturzverletzung",
        "Schlaganfall",
        "Bewusstlosigkeit",
        "Akuter Brustschmerz",
        "Keine akuten Symptome"
    ],
    Krankengeschichte: [
        "Diabetes",
        "Bluthochdruck",
        "Asthma",
        "Krebs",
        "Schlaganfall in Vorgeschichte",
        "Depression",
        "Herzrhythmusstörungen",
        "Rheuma",
        "Nierenerkrankung"
    ],
    Lebensumstände: [
        "Beruflicher Stress",
        "Schlafmangel",
        "Kürzliche Reise",
        "Psychische Belastung",
        "Ernährungsumstellung",
        "Körperliche Überlastung"
    ],
    Symptome: [
        "Schwäche",
        "Schmerzen",
        "Atemnot",
        "Schwindel",
        "Schwellungen",
        "Fieber",
        "Taubheit",
        "Sehstörungen",
        "Ohrenschmerzen",
        "Magen-Darm-Beschwerden"
    ],
    Internistisch: [
        "Appetitlosigkeit",
        "Schlaflosigkeit",
        "Müdigkeit",
        "Schwindel",
        "Durchfall",
        "Erbrechen",
        "Gewichtsverlust",
        "Sodbrennen",
        "Blähungen",
        "Bauchschmerzen"
    ],
    Hausaerztlich: [
        "Hautausschlag",
        "Juckreiz",
        "Schwellungen",
        "Blutungen",
        "Krämpfe",
        "Lähmungen",
        "Entzündungen",
        "Wundheilungsstörungen",
        "Warzen"
    ],
    Gynäkologie: [
        "Unregelmäßiger Zyklus",
        "Unterleibsschmerzen",
        "Starke Menstruationsblutung",
        "Schwangerschaftsübelkeit",
        "Wechseljahresbeschwerden",
        "Brustschmerzen"
    ],
    Kardiologie: [
        "Brustschmerzen",
        "Herzrasen",
        "Hoher Blutdruck",
        "Atemnot bei Belastung",
        "Ödeme"
    ],
    Pulmologie: [
        "Chronischer Husten",
        "Atemnot",
        "Pfeifendes Atemgeräusch",
        "Schlafapnoe",
        "Lungenentzündung"
    ],
    Orthopädie: [
        "Rückenschmerzen",
        "Gelenkschmerzen",
        "Bewegungseinschränkungen",
        "Sehnenscheidenentzündung",
        "Arthritis"
    ],
    Neurologie: [
        "Kopfschmerzen",
        "Schwindel",
        "Taubheitsgefühle",
        "Lähmungen",
        "Gedächtnisprobleme"
    ],
    Dermatologie: [
        "Hautausschläge",
        "Juckreiz",
        "Verfärbungen der Haut",
        "Muttermalveränderungen",
        "Ekzeme"
    ],
    Psychiatrie: [
        "Schlafstörungen",
        "Depressionen",
        "Angstzustände",
        "Stressbelastung",
        "Burnout-Symptome"
    ],
    HNO: [
        "Ohrenschmerzen",
        "Schluckbeschwerden",
        "Hörverlust",
        "Tinnitus",
        "Nasennebenhöhlenentzündung"
    ],
    Gastroenterologie: [
        "Übelkeit",
        "Bauchschmerzen",
        "Blähungen",
        "Durchfall",
        "Sodbrennen"
    ],
    Urologie: [
        "Schmerzen beim Wasserlassen",
        "Blut im Urin",
        "Harnwegsinfekte",
        "Inkontinenz",
        "Nierensteine"
    ],
    Endokrinologie: [
        "Schilddrüsenbeschwerden",
        "Gewichtszunahme",
        "Gewichtsverlust",
        "Müdigkeit",
        "Diabetes-Management"
    ],
    Pädiatrie: [
        "Fieber bei Kindern",
        "Impfberatung",
        "Entwicklungsverzögerungen",
        "Infektionskrankheiten",
        "Allergien"
    ],
    Geriatrie: [
        "Sturzrisiko",
        "Multimorbidität",
        "Gedächtnisverlust",
        "Chronische Schmerzen",
        "Polypharmazie"
    ],
    Onkologie: [
        "Knoten oder Schwellungen",
        "Unerklärlicher Gewichtsverlust",
        "Müdigkeit",
        "Anämie",
        "Nachsorge von Krebserkrankungen"
    ],
    Infektiologie: [
        "Fieber unklarer Ursache",
        "Hautinfektionen",
        "Grippesymptome",
        "Reiseassoziierte Infektionen",
        "Impfberatung"
    ],
    Augenheilkunde: [
        "Sehstörungen",
        "Rötung oder Schmerzen im Auge",
        "Lichtempfindlichkeit",
        "Augenentzündungen",
        "Fremdkörpergefühl im Auge"
    ],
    Rheumatologie: [
        "Gelenkschmerzen",
        "Morgensteifigkeit",
        "Autoimmunerkrankungen",
        "Schwellungen",
        "Müdigkeit"
    ],
    Reisemedizin: [
        "Impfungen",
        "Reisevorbereitung",
        "Tropische Krankheiten",
        "Reiseassoziierte Infektionen",
        "Höhenkrankheit"
    ],
    Ernährungsmedizin: [
        "Übergewicht",
        "Nahrungsmittelunverträglichkeiten",
        "Mangelernährung",
        "Essstörungen",
        "Ernährungsberatung"
    ]
};


export const placeHolderInput = ['Symptome, Details, Alter, Geschlecht, Medis eingeben...'];

export { examplesData, rawInitialMessages };
