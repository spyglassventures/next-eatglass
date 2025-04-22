import examplesData from '../sidebar_examples/grippe_sidebar_config.json';
import rawInitialMessages from '../ai_context/arbeitszeugnis_message.json';
export const warning_msg = 'Closed-Beta Test: Schlüsselinhalte anklicken ➜ Grippeverordnung erhalten';

export const followupBtn = ['mehr Argumente', 'eloquenter formulieren', 'übersetze in Englisch'];
export const inputCloudBtn = {
    // 0. Einleitung & Abschluss (New Category)
    'Einleitung & Abschluss': [

        "Wir bestätigen gerne die Zusammenarbeit mit Frau [], geb. am [].",
        "Frau [] war vom [Datum] bis [Datum] in unserer Praxis tätig.",
        "Wir lernten Frau [] als eine besondere, engagierte Persönlichkeit kennen.",
        "Sie arbeitete in kollegialer und vertrauensvoller Weise mit uns zusammen.",
        "Wir danken Frau [] herzlich für die wertvolle Zusammenarbeit.",
        "Wir bedanken uns für die loyale Zusammenarbeit.",
        "Wir wünschen ihr für die weitere private und berufliche Zukunft alles Gute.",
        "Wir wünschen ihr für ihre Zukunft alles Gute und weiterhin viel Erfolg.",
    ],
    // 1. Beschäftigungsdetails
    'Beschäftigungsdetails': [
        "Frau []",
        "Geburtsdatum: []",
        "Beschäftigt vom [] bis []",
        "Tätig vom [] bis []",
        "Wintersaison vom [] bis []",
        "Position: leitende MPA",
        "Position: MPA",
        "Position: MPA mit weitreichenden Aufgaben",
        "Position: Lehrling",
        "Position: Aushilfe",
    ],
    // 2. Praxisbeschreibung
    'Praxisbeschreibung': [
        "große Hausarztpraxis",
        "Hausarztpraxis",
        "Grundversorgungs‑ und Notfallpraxis",
        "Praxis mit [Anzahl] Ärzten",
        "voll elektronische Praxis",
        "vollelektronische Praxis (Achilles‑System)",
        "vollelektronische Praxis (Vitodata‑System)",
        "moderne Infrastruktur",
        "regelmäßiger Notfalldienst",
        "24h Notfalldienst (auch Wochenende)",
    ],


    // 3. Administrativer Bereich
    'Administrativer Bereich': [
        "Ihr Aufgabengebiet umfasste:",
        "Ihr Aufgabengebiet umfasste unter anderem:",

        "Empfang & Telefon",
        "Empfang (System: [])", // E.g., Vitodata, Achilles
        "Post‑ & Email‑Bearbeitung",
        "Stammdatenpflege",
        "elektronische KG & Agenda",
        "Terminvergabe & Triage",
        "Beratung & Bestellungen",
        "Beratungsgespräche (Patienten, Ärzte, Spitäler)",
        "Materialbewirtschaftung",
        "Bestellung von Medikamenten und Verbrauchsmaterial",
        "Medikamentenbestellung",
        "Verbrauchsmaterialbestellung",
        "Vorbereitung und Abgabe der Medikamente",
        "Medikamentenabgabe & ‑vorbereitung",
        "Scannen & Dokumentenversand",
        "elektronische Archivierung",
        "Überweisungsschreiben übermitteln/faxen",
        "Berichte anfordern",
        "Ausstellung von Rezepten, Verordnungen, AUZ",
        "Abrechnung (Kassen & Patienten)",
        "Optimierung von Bestellsystemen",
        "Ansprechperson für Pharmavertreter",
        "Lernenden‑Ausbildung",
        "Qualitäts‑/Hygieneverantwortl.",
        "Team‑Organisation & Dienstpläne",
    ],
    // 4. Praktischer Bereich
    'Praktischer Bereich': [
        "venöse & kapilläre Blutentnahmen",
        "Laboranalyse",
        "Laboranalyse (Geräte: z.B. Spotchem, Cobas, D‑Concept, Micros CRP 200, Nycocard)",
        "Impfungen & Injektionen",
        "Injektionen (i.m., s.c., i.v.)",
        "Nasopharyngealabstriche",
        "Infusionsbehandlungen",
        "Infusionen (Eisen, Schmerzmittel) vorbereiten, legen & überwachen",
        "Blutdruck‑ & Pulsmessung",
        "Blutdruck‑/EKG‑/Lungenfunktionsdiagnostik",
        "EKG durchführen",
        "Lungenfunktion durchführen",
        "Ergometrie‑Vorbereitung",
        "Röntgen (Niedrigdosis)",
        "Röntgen (digital)",
        "Notfallversorgung & Wundversorgung",
        "Überwachung von Notfallpatienten",
        "Vorbereitung und Assistenz bei kleinen chirurgischen Eingriffen",
        "Assistenz bei Kleineingriffen",
        "Instrumenten‑Sterilisation",
        "Medizinische Instrumente reinigen und sterilisieren",
        "24h‑Blutdruckmessung (Anlegen & Auswerten)",
        "24h‑EKG (Anlegen & Auswerten)",
        "Anlegen von Gipsen, Schienen & Verbänden",
        "Prick‑Tests",
        "Fagerström‑Tests",
        "MMST‑Tests",
    ],
    // 5. Beurteilung
    'Beurteilung': [
        "zuverlässig, verantwortungsbewusst, belastbar",
        "stets motiviert, belastbar und ausdauernd",
        "identifiziert sich stets mit ihren Aufgaben",
        "hohe Identifikation mit Aufgaben",
        "arbeitet konstant, sicher und selbständig",
        "kompetente Patientenkommunikation",
        "kompetenter Einsatz des Fachwissens",
        "verfügt über ein breites medizinisches Wissen",
        "breites medizinisches Fachwissen",
        "schnell, sorgfältig & proaktiv",
        "erledigte Aufgaben speditiv, sehr sorgfältig und selbständig",
        "Organisationstalent & Entscheidungssicherheit",
        "hervorragende Team‑Integration",
        "konnte sich gut in das Team einbringen",
        "hilfsbereit & Einsatzbereitschaft",
        "Bereitschaft zu Mehrarbeit/Überstunden",
        "Verhalten gegenüber Vorgesetzten, Kollegen & Patienten stets einwandfrei.",
        "Verhalten höflich, respektvoll, einfühlsam und zuvorkommend.",
        "wurde von den Patienten sehr geschätzt.",
        "hohe Wertschätzung durch Patienten",
        "Mit ihren Leistungen waren wir sehr zufrieden.",
        "Mit ihren Leistungen waren wir stets zufrieden.",
        "hat unsere Erwartungen wiederholt übertroffen.",
        "hohes Engagement & Eigeninitiative",
        "Einbringen von Verbesserungsvorschlägen",
        "Förderung des Teamgeistes",
        "Mitdenken bei wirtschaftlichen Aspekten",
        "maßgebliche Beteiligung an [Projekt/Aufgabe]", // e.g., Umsetzung Notfalldienst
    ],
    // 6. Austritt
    'Austritt': [
        "auf eigenen Wunsch",
        "hat sich entschieden, das Arbeitsverhältnis zu beenden.",
        "berufliche Neuorientierung",
        "Wir bedauern ihren Austritt sehr.",
        "Ende der Lehre",
        "Ende der Lehre und wir konnten sie nicht übernehmen.",
        "Pensionierung  von mir",
        "befristeter Arbeitsvertrag",
    ],
    // 7. Referenzkontakt
    'Referenzkontakt': [
        "Referenzauskünfte erteilen wir gerne auf Anfrage.",
        "per Email gerne auf Anfrage",
        "per Telefon gerne auf Anfrage",
    ],
};

export const placeHolderInput = ['Kategorie anklicken, um Details einzufügen…'];

export { examplesData, rawInitialMessages };