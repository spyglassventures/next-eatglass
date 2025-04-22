// File: utils/promptGenerator.ts

// Define the structure for a single AI parameter configuration
export interface AiParameterConfig {
    id: keyof AiPromptParams; // Use keys from the interface for type safety
    label: string;
    defaultChecked: boolean;
    promptInstruction: string; // The text to add to the prompt if checked
}

// Define the actual parameters centrally
export const aiParameterDefinitions: AiParameterConfig[] = [
    {
        id: 'orthography',
        label: 'Orthographische Korrektur',
        defaultChecked: true,
        promptInstruction: 'Korrigiere sämtliche orthographische Fehler (Rechtschreibung) und grammatikalische Fehler.',
    },
    {
        id: 'language',
        label: 'Sprachliche Verbesserung (Stil)',
        defaultChecked: false,
        promptInstruction: 'Verbessere den sprachlichen Stil, die Satzstruktur und die allgemeine Lesbarkeit. Formuliere Sätze klarer und prägnanter, wo sinnvoll.',
    },
    {
        id: 'isMedicalReport',
        label: 'Als Arztbericht formatieren',
        defaultChecked: false,
        promptInstruction: 'Formatiere den gesamten Text als professionellen medizinischen Bericht. Nutze sinnvolle Absätze für verschiedene Themenbereiche (z.B. Anamnese, Befund, Diagnose, Prozedere). Stelle Aufzählungen (Listen) korrekt dar, falls sie im Text vorkommen oder sinnvoll sind.',
        // Note: Add alternative prompt logic if needed within generateSystemPrompt
    },
    {
        id: 'fixInterpretation',
        label: 'Kontextbasierte Korrektur (Fehlinterpretationen)',
        defaultChecked: false,
        promptInstruction: 'Analysiere den Text auf wahrscheinliche Fehlinterpretationen durch die Spracherkennungssoftware. Korrigiere diese basierend auf dem üblichen medizinischen Kontext und Fachjargon (z.B. falsch erkannte Abkürzungen, Laborwerte, Schweizer Institutionen, Zahlen, Namen). Sei dabei vorsichtig und ändere nur, wenn eine Fehlinterpretation sehr wahrscheinlich ist.',
    },
    {
        id: 'kg_Eintrag',
        label: 'KG Eintrag erstellen aus Transkription',
        defaultChecked: true,
        promptInstruction: 'Analysiere die Transkription eines Tonmitschnittes einer hausaerztlichen Konsultation in der Praxis. Erstelle daraus einen kurzes Krankengeschichteneintrag. Beziehe dich dabei auf die wichtigsten Informationen, die für den Eintrag relevant sind. Achte darauf, dass der Eintrag klar und präzise formuliert ist. Verwende medizinische Fachbegriffe, wo es angebracht ist, und achte auf hohe Informationsdichte. Folge diesem Muster: AP (aktuelles Problem), B: (Befunde), T: (Therapie und Bewertung), P: (Prozerde)',
    },
    // --- Add new parameters here in the future ---
    // {
    //   id: 'summarize',
    //   label: 'Kurze Zusammenfassung',
    //   defaultChecked: false,
    //   promptInstruction: 'Fasse den Inhalt am Ende kurz zusammen.',
    // },
];

// Interface defining the shape of the state object holding boolean values
// (Ensure keys match the 'id' fields in aiParameterDefinitions)
export interface AiPromptParams {
    orthography: boolean;
    language: boolean;
    isMedicalReport: boolean;
    fixInterpretation: boolean;
    // summarize: boolean; // Add keys here if you add new parameters
    // Add other keys corresponding to 'id' in definitions
    [key: string]: boolean; // Allow for dynamic keys if needed, though explicit is safer
}

/**
 * Generates a system prompt for the AI based on selected parameters.
 * @param params - An object containing the boolean flags for AI instructions.
 * @returns The generated system prompt string.
 */
export const generateSystemPrompt = (params: AiPromptParams): string => {
    let instructions: string[] = [];

    // --- Basis-Rollendefinition ---
    let prompt = "Du bist ein hilfreicher Assistent zur Korrektur und Verbesserung von Texten, die aus medizinischen Audiodiktaten stammen.\n";
    prompt += "Der Benutzereingabe-Text kann HTML Formatierungen enthalten (z.B. <p>, <strong>, <ul>, <li>).\n";
    prompt += "Deine Aufgabe ist es, den Textinhalt gemäß den spezifischen Anweisungen zu korrigieren und zu strukturieren.\n\n";

    // --- WICHTIG: Ausgabeformat-Anweisung ---
    prompt += "AUSGABEFORMAT-ANWEISUNG:\n";
    prompt += "- Erkannte HTML Elemente werden in Markup übersetzt.(z.B. <strong> wird zu **text**)\n"; // <<< NEU: HTML Output fordern
    prompt += "- Der korrigierte Text darf keine HTML-Tags enthalten\n";
    prompt += "- Behalte Aufzählungen bei.\n";


    // --- Spezifische Korrekturanweisungen (basierend auf Auswahl) ---
    prompt += "SPEZIFISCHE BEARBEITUNGSANWEISUNGEN FÜR DEN INHALT:\n";

    // Loop through definitions to build instructions
    aiParameterDefinitions.forEach(paramConfig => {
        if (params[paramConfig.id]) { // Check if the parameter is true in the state object
            // Special handling for medical report formatting (alternative if unchecked)
            if (paramConfig.id === 'isMedicalReport') {
                instructions.push(paramConfig.promptInstruction);
            } else {
                instructions.push(paramConfig.promptInstruction);
            }
        } else {
            // Add instruction for unchecked medical report if needed
            if (paramConfig.id === 'isMedicalReport') {
                instructions.push("Strukturiere den Text durch sinnvolle Absatzumbrüche (keine spezifische Arztbericht-Formatierung).");
            }
        }
    });

    // Ensure basic formatting instruction if 'isMedicalReport' is not defined or false,
    // and no other instruction pushes basic formatting. This logic might need refinement
    // depending on how exclusive instructions should be.
    const hasFormattingInstruction = instructions.some(instr => instr.includes('Absatz') || instr.includes('Formatierung'));
    if (!params.isMedicalReport && !hasFormattingInstruction) {
        instructions.push("Strukturiere den Text durch sinnvolle Absatzumbrüche.");
    }


    // Combine instructions (remains the same)
    if (instructions.length > 0) {
        instructions.forEach(instr => prompt += `- ${instr}\n`);
    } else {
        prompt += "- Gib den Text genau so zurück, wie er eingegeben wurde.\n";
    }

    // Output Formatting Instruction (remains the same)
    prompt += "\nWICHTIG: Deine Antwort darf *ausschließlich* den bearbeiteten Text enthalten. Füge keine Einleitungssätze, keine Kommentare, keine Erklärungen und keine Schlussbemerkungen hinzu. Nur der reine, bearbeitete Text ist erwünscht.";

    return prompt;
};