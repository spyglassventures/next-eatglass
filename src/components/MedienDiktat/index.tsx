// File: app/medien/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import AudioRecorder from "../../components/Transcribe/AudioRecorder";
import TranscriptSidebar from "@/components/MedienDiktat/TranscriptSidebar";
import AiParameterBox from "@/components/MedienDiktat/AiParameterBox"; // <-- Import the new component
import Image from 'next/image';

import { diffWords } from "diff";
// Import the utility functions and the interface
import {
    Transcription,
    loadTranscriptionsFromStorage,
    saveTranscriptionsToStorage

} from "../../app/utils/transcriptionStore";




// The Transcription interface is now imported, so you can remove the local definition if you had one

export default function MedienDiktat() {
    const [transcription, setTranscription] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [loading, setLoading] = useState(false); // Note: 'loading' state doesn't seem used, consider removing if true.
    const [error, setError] = useState<string | null>(null);

    const [showRecorder, setShowRecorder] = useState(true);
    const [previousTranscriptions, setPreviousTranscriptions] = useState<Transcription[]>([]);
    const [isRealtimeActive, setIsRealtimeActive] = useState(false);
    const [realtimeText, setRealtimeText] = useState<string>("");
    const [saveLocal, setSaveLocal] = useState(true);

    const recognitionRef = useRef<any>(null);
    const finalTranscriptRef = useRef<string>("");

    const primaryColor = "#24a0ed";

    // --- NEW: State for AI Parameters ---
    const [paramOrthography, setParamOrthography] = useState(true);
    const [paramLanguage, setParamLanguage] = useState(true);
    const [paramIsMedicalReport, setParamIsMedicalReport] = useState(true);
    const [paramFixInterpretation, setParamFixInterpretation] = useState(true);
    // --- END NEW STATE ---

    // --- Handlers for Parameter Changes ---
    const handleParamOrthographyChange = (checked: boolean) => setParamOrthography(checked);
    const handleParamLanguageChange = (checked: boolean) => setParamLanguage(checked);
    const handleParamMedicalReportChange = (checked: boolean) => setParamIsMedicalReport(checked);
    const handleParamFixInterpretationChange = (checked: boolean) => setParamFixInterpretation(checked);
    // --- END Handlers ---

    // 1) Load from localStorage ONCE (on mount) using the utility function
    useEffect(() => {
        setPreviousTranscriptions(loadTranscriptionsFromStorage());

        // Cleanup function for speech recognition
        return () => {
            recognitionRef.current?.stop();
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // REMOVED: The persistTranscriptions helper function is no longer needed here.

    // Create + show new transcription in main UI.
    // ONLY add to the sidebar + localStorage if "saveLocal" is true.
    const handleNewTranscription = (text: string) => {
        setTranscription(text); // Always show in main UI

        if (!saveLocal) {
            return; // Skip saving if checkbox is unchecked
        }

        // Build the new item
        const newItem: Transcription = {
            id: Date.now().toString(),
            text,
            date: new Date().toLocaleString("de-DE"),
        };
        // Update state and save using the utility function
        const updated = [newItem, ...previousTranscriptions].slice(0, 10);
        setPreviousTranscriptions(updated);
        saveTranscriptionsToStorage(updated); // Use the imported function
    };

    // Delete item from the sidebar array + localStorage
    const deleteTranscription = (id: string) => {
        const updated = previousTranscriptions.filter((t) => t.id !== id);
        setPreviousTranscriptions(updated);
        saveTranscriptionsToStorage(updated); // Use the imported function
    };

    // ========== AUDIO FILE TRANSCRIPTION LOGIC ============
    const [loadingFileTranscription, setLoadingFileTranscription] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setAudioBlob(e.target.files[0]);
        }
    };

    const handleRecordingComplete = (blob: Blob) => {
        setAudioBlob(blob);
    };

    const transcribeAudio = async () => {
        if (!audioBlob) {
            return setError("Bitte laden Sie zuerst eine Audiodatei hoch oder nehmen Sie eine auf.");
        }
        setLoadingFileTranscription(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("file", audioBlob, "audio.wav");
            const res = await axios.post("/api/transcribe", formData);
            const text = res.data.DisplayText || "Keine Transkription gefunden.";
            handleNewTranscription(text); // This now handles saving if saveLocal is true
        } catch (err) {
            console.error("Fehler:", err);
            setError("Fehler bei der Transkription der Audiodatei.");
        } finally {
            setLoadingFileTranscription(false);
        }
    };

    // ========== REAL-TIME TRANSCRIPTION LOGIC ============
    const startRealtimeTranscription = () => {
        if (!("webkitSpeechRecognition" in window)) {
            setError("Echtzeit-Transkription wird in diesem Browser nicht unterstützt.");
            return;
        }
        setRealtimeText("");
        finalTranscriptRef.current = "";
        setIsRealtimeActive(true);

        const recognition = new (window as any).webkitSpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "de-DE";

        recognition.onresult = (event: any) => {
            let interimTranscript = "";
            let finalTranscript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i][0].transcript + " ";
                if (event.results[i].isFinal) {
                    finalTranscript += result;
                } else {
                    interimTranscript += result;
                }
            }
            if (finalTranscript) {
                finalTranscriptRef.current += finalTranscript;
            }
            setRealtimeText(finalTranscriptRef.current + interimTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error("Spracherkennungsfehler:", event.error);
            setError("Fehler bei der Echtzeit-Transkription.");
            stopRealtimeTranscription();
        };

        recognition.start();
    };

    const stopRealtimeTranscription = () => {
        setIsRealtimeActive(false);
        recognitionRef.current?.stop();

        const finalText = finalTranscriptRef.current.trim();
        if (finalText) {
            handleNewTranscription(finalText); // This now handles saving if saveLocal is true
        }
        finalTranscriptRef.current = "";
    };

    const toggleRealtimeMode = () => {
        if (isRealtimeActive) {
            stopRealtimeTranscription();
        } else {
            startRealtimeTranscription();
        }
    };

    // ========== UI Handlers for tabs ============
    const [loadingMode, setLoadingMode] = useState("Aufnahme");

    const handleTabClick = (label: string) => {
        if (isRealtimeActive) {
            stopRealtimeTranscription(); // Stop real-time if switching tabs
        }
        // Reset audio blob when switching away from upload/record modes? Optional.
        // setAudioBlob(null);

        setLoadingMode(label); // Keep track of the conceptual mode

        if (label === "Aufnahme") {
            setShowRecorder(true);
            setIsRealtimeActive(false); // Ensure real-time is off
        } else if (label === "Datei hochladen") {
            setShowRecorder(false);
            setIsRealtimeActive(false); // Ensure real-time is off
        } else if (label === "Echtzeit") {
            setShowRecorder(false); // Recorder UI not needed for real-time
            startRealtimeTranscription(); // Start real-time directly
        }
    };

    // Updated logic for determining active tab, considering isRealtimeActive state
    const isActiveTab = (label: string) => {
        if (label === "Echtzeit") {
            return isRealtimeActive;
        }
        if (isRealtimeActive) {
            return false; // If real-time is active, other tabs are not
        }
        if (label === "Aufnahme") {
            return showRecorder;
        }
        if (label === "Datei hochladen") {
            return !showRecorder;
        }
        return false;
    };


    const toggleSaveLocal = () => {
        setSaveLocal((prev) => !prev);
    };

    // =========== Sparkle function states ===============
    const [sparkleLoading, setSparkleLoading] = useState(false);
    const [sparkleResponse, setSparkleResponse] = useState("");

    // --- Function to generate system prompt dynamically ---
    const generateSystemPrompt = (): string => {
        let instructions: string[] = [];

        // Role Definition
        let prompt = "Du bist ein hilfreicher Assistent zur Korrektur und Verbesserung von Texten, die aus medizinischen Audiodiktaten stammen.\n";
        prompt += "Deine Aufgabe ist es, den folgenden Benutzereingabe-Text basierend auf den spezifischen Anweisungen zu bearbeiten.\n\n";
        prompt += "Anweisungen:\n";

        // Specific Instructions based on checkboxes
        if (paramOrthography) {
            instructions.push("Korrigiere sämtliche orthographische Fehler (Rechtschreibung) und grammatikalische Fehler.");
        }
        if (paramLanguage) {
            instructions.push("Verbessere den sprachlichen Stil, die Satzstruktur und die allgemeine Lesbarkeit. Formuliere Sätze klarer und prägnanter, wo sinnvoll.");
        }
        if (paramFixInterpretation) {
            // This is a complex task for the AI, prompt needs to be clear
            instructions.push("Analysiere den Text auf wahrscheinliche Fehlinterpretationen durch die Spracherkennungssoftware. Korrigiere diese basierend auf dem üblichen medizinischen Kontext und Fachjargon (z.B. falsch erkannte Fachbegriffe, Zahlen, Namen). Sei dabei vorsichtig und ändere nur, wenn eine Fehlinterpretation sehr wahrscheinlich ist.");
        }
        if (paramIsMedicalReport) {
            instructions.push("Formatiere den gesamten Text als professionellen medizinischen Bericht. Nutze sinnvolle Absätze für verschiedene Themenbereiche (z.B. Anamnese, Befund, Diagnose, Prozedere). Stelle Aufzählungen (Listen) korrekt dar, falls sie im Text vorkommen oder sinnvoll sind.");
        } else {
            // Basic formatting if not a medical report
            instructions.push("Strukturiere den Text durch sinnvolle Absatzumbrüche.");
        }

        // Combine instructions into the prompt
        if (instructions.length > 0) {
            instructions.forEach(instr => prompt += `- ${instr}\n`);
        } else {
            // Fallback if somehow no instructions are selected
            prompt += "- Gib den Text genau so zurück, wie er eingegeben wurde.\n";
        }

        // Output Formatting Instruction
        prompt += "\nWICHTIG: Deine Antwort darf *ausschließlich* den bearbeiteten Text enthalten. Füge keine Einleitungssätze, keine Kommentare, keine Erklärungen und keine Schlussbemerkungen hinzu. Nur der reine, bearbeitete Text ist erwünscht.";

        return prompt;
    };
    // --- END Prompt Generation ---

    const handleSparkleClick = async () => {
        if (!transcription) return;
        try {
            setSparkleLoading(true);
            setSparkleResponse(""); // Clear previous response

            // Generate the dynamic system prompt
            const systemPrompt = generateSystemPrompt();
            console.log("Generated System Prompt:", systemPrompt); // For debugging

            const messages = [
                { role: "system", content: systemPrompt }, // Use the dynamic prompt
                { role: "user", content: transcription },
            ];

            const res = await fetch("/api/az-schweiz-chat-4o-mini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages, customerName: "EatGlassVoice" }), // Ensure API expects this structure
            });

            if (!res.ok || !res.body) {
                const errorBody = await res.text(); // Try to get error details
                throw new Error(`Fehler bei der KI-Anfrage: ${res.status} ${res.statusText} - ${errorBody}`);
            }

            // Stream the response
            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let accumulated = "";
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                accumulated += decoder.decode(value, { stream: true });
                setSparkleResponse(accumulated); // Update UI incrementally
            }
            // Ensure the final chunk is decoded (though usually handled by stream: true)
            // accumulated += decoder.decode();
            // setSparkleResponse(accumulated);

        } catch (err: any) { // Catch specific error type if possible
            console.error("Sparkle error", err);
            setSparkleResponse(`Fehler beim Verarbeiten der KI-Antwort: ${err.message}`);
        } finally {
            setSparkleLoading(false);
        }
    };

    // DIFF-Hilfsfunktion
    const renderDiff = (original: string, changed: string) => {
        const diff = diffWords(original, changed);
        return diff.map((part, idx) => {
            let style = "";
            if (part.added) style = "bg-green-200";
            if (part.removed) style = "bg-red-200 line-through";
            return <span key={idx} className={style}>{part.value}</span>;
        });
    };

    // Word-Download für KI-Version
    const downloadSparkleAsWord = async () => {
        if (!sparkleResponse) return;
        try {
            const response = await fetch("/forms/Blank/Briefkopf_blank.docx");
            if (!response.ok) throw new Error(`Failed to fetch template: ${response.statusText}`);
            const arrayBuffer = await response.arrayBuffer();
            const zip = new PizZip(arrayBuffer);
            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
            doc.setData({ message: sparkleResponse.replace(/\n/g, '\n') }); // Ensure line breaks are handled
            doc.render();
            const out = doc.getZip().generate({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            saveAs(out, "Transkription_KI.docx");
        } catch (error) {
            console.error("Error generating docx for sparkle: ", error);
            alert("Fehler beim Generieren des Word-Dokuments (KI-Version).");
        }
    };

    // Word-Download für Original
    const downloadOriginalAsWord = async () => {
        if (!transcription) return;
        try {
            const response = await fetch("/forms/Blank/Briefkopf_blank.docx");
            if (!response.ok) throw new Error(`Failed to fetch template: ${response.statusText}`);
            const arrayBuffer = await response.arrayBuffer();
            const zip = new PizZip(arrayBuffer);
            const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
            doc.setData({ message: transcription.replace(/\n/g, '\n') }); // Ensure line breaks are handled
            doc.render();
            const out = doc.getZip().generate({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            saveAs(out, "Transkription_Original.docx");
        } catch (error) {
            console.error("Error generating docx for original: ", error);
            alert("Fehler beim Generieren des Word-Dokuments (Original-Version).");
        }
    };

    // --- Render JSX (mostly unchanged, ensure imports/paths are correct) ---
    return (
        <div className="flex flex-col md:flex-row bg-gray-100" style={{ minHeight: "90vh" }}>
            {/* Sidebar */}
            <TranscriptSidebar
                previousTranscriptions={previousTranscriptions}
                loadTranscription={(text) => setTranscription(text)} // Keep loading into main view state
                deleteTranscription={deleteTranscription} // Use the component's delete handler which calls the utility
                primaryColor={primaryColor}
                saveLocal={saveLocal}
                toggleSaveLocal={toggleSaveLocal}
            />

            {/* Main content */}
            <div className="flex-1 p-4 md:p-8">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full" style={{ minHeight: "80vh" }}>
                    <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: primaryColor }}>
                        Doc Dialog
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        Ihr intelligenter Audio-Transkriptionsdienst für medizinische Dokumentation
                    </p>

                    {/* Transcription Modes Selector */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                            {["Aufnahme", "Datei hochladen", "Echtzeit"].map((label) => {
                                const active = isActiveTab(label);
                                return (
                                    <button
                                        key={label}
                                        onClick={() => handleTabClick(label)}
                                        className={`px-4 py-2 rounded-md transition-colors ${active ? "text-white" : "text-gray-700 hover:bg-gray-200"}`}
                                        style={{ backgroundColor: active ? primaryColor : "transparent" }}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* UI for Aufnahme / Datei hochladen / Echtzeit (largely unchanged) */}
                    {/* ... (rest of your UI logic for different modes) ... */}
                    {/* Datei hochladen mode */}
                    {!showRecorder && !isRealtimeActive && (
                        <div className="space-y-6">
                            {/* ... file upload input ... */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept="audio/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="text-xl">📂</span>
                                        Audio hochladen
                                    </label>
                                </div>
                            </div>
                            {audioBlob && (
                                <div className="text-center">
                                    {/* ... audio controls and transcribe button ... */}
                                    <div className="p-4 bg-gray-50 rounded-lg mb-4">
                                        <p className="text-sm text-gray-600 mb-2">Audiodatei bereit für Transkription</p>
                                        <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
                                    </div>

                                    <button
                                        onClick={transcribeAudio}
                                        disabled={loadingFileTranscription}
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loadingFileTranscription ? (
                                            <span className="flex items-center gap-1 text-sm text-gray-500 bg-transparent">
                                                <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                                                </svg>
                                                Transkribiere...
                                            </span>
                                        ) : (
                                            "Audio transkribieren"
                                        )}


                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Aufnahme mode */}
                    {showRecorder && !isRealtimeActive && (
                        <div>
                            {/* ... AudioRecorder component ... */}
                            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                            {audioBlob && (
                                <div className="text-center mt-4">
                                    <button
                                        onClick={transcribeAudio}
                                        disabled={loadingFileTranscription}
                                        className={`px-6 py-3 rounded-lg shadow transition-colors disabled:cursor-not-allowed
                                   ${loadingFileTranscription
                                                ? 'bg-gray-200 text-black font-medium'
                                                : 'bg-green-500 hover:bg-green-600 text-white'}
                                 `}
                                    >
                                        {loadingFileTranscription ? (
                                            <span className="flex items-center justify-center gap-2 text-sm text-slate-600">
                                                <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                                                </svg>
                                                Transkribiere...
                                            </span>
                                        ) : (
                                            "Audio transkribieren"
                                        )}
                                    </button>
                                </div>


                            )}
                        </div>
                    )}

                    {/* Echtzeit mode */}
                    {isRealtimeActive && (
                        <div className="space-y-4">
                            {/* ... real-time UI elements ... */}
                            <div className="p-6 rounded-xl mb-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-lg border border-gray-200">
                                <p className="text-base mb-4 text-gray-800 font-medium leading-relaxed">
                                    Sprachtranskribierung in Echtzeit. Sie können nun sprechen und sehen die Transkription weiter unten. Satzgebung und Formatierung erfolgt im Anschluss mit Hilfe der KI.
                                </p>
                            </div>
                            {realtimeText && (
                                <div className="p-5 border rounded-lg" style={{ backgroundColor: "rgba(36, 160, 237, 0.1)", borderColor: "rgba(36, 160, 237, 0.3)" }}>
                                    <div className="flex justify-between items-start">
                                        <h2 className="font-bold text-lg mb-2" style={{ color: primaryColor }}> Echtzeit-Transkription: </h2>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-line">{realtimeText}</p>
                                </div>
                            )}
                            <button onClick={stopRealtimeTranscription} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"> Aufnahme stoppen </button>
                        </div>
                    )}

                    {/* Error msg */}
                    {error && (<div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg"> <p className="flex items-center gap-2"> <span className="text-xl">⚠️</span> {error} </p> </div>)}

                    {/* Final Transcription Display (Original + KI) */}
                    {transcription && !isRealtimeActive && (
                        <div className="mt-6">
                            <div className="flex gap-4" style={{ minHeight: "400px" }}>
                                {/* BOX 1: Original */}
                                <div className="w-full md:w-1/2 p-3 border rounded bg-gray-50 overflow-auto flex flex-col">
                                    <h2 className="font-bold text-md mb-2" style={{ color: primaryColor }}>
                                        Transkription (Aufnahme)
                                    </h2>
                                    {/* MODIFIED LINE BELOW */}
                                    <div className="text-xs font-light whitespace-pre-wrap flex-1 leading-relaxed">
                                        {transcription}
                                    </div>
                                    {/* END MODIFIED LINE */}
                                    <button
                                        onClick={downloadOriginalAsWord}
                                        className="mt-3 inline-flex items-center border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out self-start"
                                        title="Original-Transkription als Word-Datei herunterladen"
                                    >
                                        {/* === ICON START === */}
                                        <div className="relative mr-1.5 h-4 w-4">
                                            <Image
                                                src="/images/brands/Microsoft-Word-Icon-PNG.png"
                                                alt="Word Icon"
                                                fill
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </div>
                                        {/* === ICON END === */}
                                        Original als Word runterladen
                                    </button>
                                </div>
                                {/* BOX 2: KI Version Container */}
                                <div className="w-full md:w-1/2 p-3 border rounded bg-gray-50 overflow-auto flex flex-col">
                                    {/* Header for KI Box */}
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="font-bold text-md" style={{ color: primaryColor }}>
                                            Verfeinerte Version (KI)
                                        </h2>
                                        {/* Sparkle Button stays here */}
                                        <button
                                            onClick={handleSparkleClick}
                                            className="inline-flex items-center px-3 py-1 rounded bg-blue-500 hover:bg-purple-600 hover:animate-pulse text-white text-sm font-medium disabled:opacity-50"
                                            disabled={sparkleLoading || !transcription}
                                            title="KI-Verarbeitung starten" // Tooltip
                                        >
                                            {/* Loading indicator or Sparkle icon */}
                                            {sparkleLoading
                                                ? <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                : <span className="mr-1">✨</span>
                                            }
                                            KI
                                        </button>
                                    </div>

                                    {/* --- INSERT AI PARAMETER BOX --- */}
                                    <AiParameterBox
                                        orthography={paramOrthography}
                                        language={paramLanguage}
                                        isMedicalReport={paramIsMedicalReport}
                                        fixInterpretation={paramFixInterpretation}
                                        onOrthographyChange={handleParamOrthographyChange}
                                        onLanguageChange={handleParamLanguageChange}
                                        onMedicalReportChange={handleParamMedicalReportChange}
                                        onFixInterpretationChange={handleParamFixInterpretationChange}
                                        primaryColor={primaryColor}
                                    />
                                    {/* --- END AI PARAMETER BOX --- */}


                                    {/* KI Response Area */}
                                    <div className="flex-1"> {/* Make this div take remaining space */}
                                        {sparkleLoading && (
                                            <div className="text-sm text-gray-500 text-center p-4">KI-Antwort wird generiert...</div>
                                        )}
                                        {/* Apply text-xs and font-light here */}
                                        {!sparkleLoading && sparkleResponse && (
                                            // <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                            <div className="text-xs font-light whitespace-pre-wrap flex-1 leading-relaxed">
                                                {/* DIFF View */}
                                                {renderDiff(transcription, sparkleResponse)}
                                            </div>
                                        )}
                                        {/* Placeholder when no KI response and not loading */}
                                        {!sparkleLoading && !sparkleResponse && (
                                            <div className="text-sm text-gray-400 text-center p-4 italic">
                                                Klicken Sie auf ✨KI, um basierend auf den obigen Anweisungen eine Version zu generieren. Sie können die Korrektur auch mehrmals mit unterschiedlicher Konfiguration wiederholen.
                                            </div>
                                        )}
                                    </div>

                                    {/* Download KI Version Button (only if response exists) */}
                                    {!sparkleLoading && sparkleResponse && (
                                        <button
                                            onClick={downloadSparkleAsWord}
                                            className="mt-3 inline-flex items-center border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out self-start"
                                            title="KI-Version als Word-Datei herunterladen"
                                        >
                                            {/* === ICON START === */}
                                            <div className="relative mr-1.5 h-4 w-4">
                                                <Image
                                                    src="/images/brands/Microsoft-Word-Icon-PNG.png"
                                                    alt="Word Icon"
                                                    fill
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </div>
                                            {/* === ICON END === */}
                                            KI Version als Word runterladen
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}