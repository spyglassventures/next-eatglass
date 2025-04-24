// File: app/medien/page.tsx

// add check if 25mb or lower

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

import AudioRecorder from "../../components/Transcribe/AudioRecorder";
import TranscriptSidebar from "@/components/MedienDiktat/TranscriptSidebar";
import AiParameterBox from "@/components/MedienDiktat/AiParameterBox"; // <-- Import the new component
import Image from 'next/image';
import { generateDocx } from '../../app/utils/docxGenerator'; // Adjust path if needed
import { CommandLineIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

import RealtimeTranscription from "@/components/Transcribe/RealtimeTranscription"; // Pfad ggf. anpassen
import { useFileLogger } from './useFileLogger';




import { diffWords } from "diff";
// Import the utility functions and the interface
import {
    Transcription,
    loadTranscriptionsFromStorage,
    saveTranscriptionsToStorage

} from "../../app/utils/transcriptionStore";

import OriginalTranscriptionDisplay from '@/components/MedienDiktat/OriginalTranscriptionDisplay';
import KiTranscriptionDisplay from '@/components/MedienDiktat/KiTranscriptionDisplay';
import {
    aiParameterDefinitions, // Import the definitions
    AiPromptParams,          // Import the state type
    generateSystemPrompt
} from '../../app/utils/promptGenerator'; // Adjust path

// Adjust path as necessary
import { downloadBlob } from '../../app/utils/downloadUtils';

import { stripHtml } from '../../app/utils/textUtils'; // used to clean up the text from html tags



// The Transcription interface is now imported, so you can remove the local definition if you had one

export default function MedienDiktat() {
    const [transcription, setTranscription] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<File | null>(null);
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

    const MAX_BYTES = 25 * 1024 * 1024;  // 25 MB in bytes

    const { writeAll, clearLog, ready: loggerReady } = useFileLogger();
    const logTimer = useRef<number>();


    const ENGINES = [
        { key: "gpt4o", label: "Transkript (Azure GPT‑4o)", route: "/api/transcribe_az-gpt-4o-transcribe" },
        { key: "gpt4o_ft", label: "KG Eintrag (Azure GPT‑4o, fine‑tuned)", route: "/api/transcribe_az-gpt-4o-finetuned" },
        { key: "speech", label: "Azure Speech", route: "/api/transcribe_az_speech" },
        { key: "whisper", label: "Whisper", route: "/api/transcribe_az_whisper" },


    ] as const;


    type EngineKey = typeof ENGINES[number]["key"];


    const [engineIndex, setEngineIndex] = useState(0); // 0 = Whisper by default

    // Helper to access current engine
    const currentEngine = ENGINES[engineIndex];

    // const [currentApiRoute, setCurrentApiRoute] = useState<string>(WHISPER_API_ROUTE); // Default to Whisper

    // lift state of edited transaction up 
    // Add this near your other useState hooks
    const [currentEditedTranscription, setCurrentEditedTranscription] = useState<string>('');



    // --- CENTRALIZED AI Parameter State ---
    // Initialize state dynamically from the definitions
    const initialAiParamsState = (): AiPromptParams => {
        const initialState: Partial<AiPromptParams> = {};
        aiParameterDefinitions.forEach(param => {
            initialState[param.id] = param.defaultChecked;
        });
        return initialState as AiPromptParams; // Cast to the full type
    };

    const [aiParamsState, setAiParamsState] = useState<AiPromptParams>(initialAiParamsState());

    // Single handler for all AI parameter checkboxes
    const handleAiParamChange = (paramId: keyof AiPromptParams, checked: boolean) => {
        setAiParamsState(prevParams => ({
            ...prevParams,
            [paramId]: checked,
        }));
    };

    const handleTranscriptionEditorChange = useCallback((newValue: string) => {
        setCurrentEditedTranscription(newValue);
    }, []); // Empty dependency array is fine here
    // --- END CENTRALIZED AI State ---

    useEffect(() => {
        if (!isRealtimeActive || !loggerReady) return;

        // 1) write the full realtime text
        writeAll(realtimeText);

        // 2) reset a 3s timer to clear log.txt when typing stops
        if (logTimer.current) clearTimeout(logTimer.current);
        logTimer.current = window.setTimeout(() => {
            clearLog();
        }, 3000);
    }, [realtimeText, isRealtimeActive, loggerReady]);





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
        setCurrentEditedTranscription(text);

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
    const cycleEngine = () => {
        setEngineIndex((idx) => (idx + 1) % ENGINES.length);
    };


    // const getCurrentApiName = () => {
    //     return currentApiRoute === WHISPER_API_ROUTE ? "Whisper" : "Azure Speech";
    // };

    const [loadingFileTranscription, setLoadingFileTranscription] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setAudioBlob(e.target.files[0]);
        }
    };

    const handleRecordingComplete = (blob: Blob) => {
        // Turn the anonymous blob into a File named “recording.wav”
        const file = new File(
            [blob],
            "recording.wav",
            { type: blob.type, lastModified: Date.now() }
        );
        setAudioBlob(file);
    };

    const transcribeAudio = async () => {
        if (!audioBlob) {
            return setError("Bitte laden Sie zuerst eine Audiodatei hoch oder nehmen Sie eine auf.");
        }
        if (audioBlob.size > MAX_BYTES) {
            return setError("Die Datei überschreitet das 25 MB‑Limit.");
        }

        setLoadingFileTranscription(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", audioBlob, audioBlob.name);

            const res = await axios.post(currentEngine.route, formData);
            const text =
                // adjust according to which engine returns which key
                res.data.DisplayText ??
                res.data.transcriptionText ??
                "Keine Transkription gefunden.";

            handleNewTranscription(text);
        } catch (err) {
            console.error("Fehler bei der Transkription:", err);
            setError("Fehler bei der Transkription der Audiodatei.");
        } finally {
            setLoadingFileTranscription(false);
        }
    };


    // ========== UI Handlers for tabs ============
    const [loadingMode, setLoadingMode] = useState("Aufnahme");

    const handleTabClick = (label: string) => {
        if (isRealtimeActive) {
            setIsRealtimeActive(false); // Let <RealtimeTranscription /> handle stopping
        }

        setLoadingMode(label); // Keep track of the conceptual mode

        if (label === "Aufnahme") {
            setShowRecorder(true);
            setIsRealtimeActive(false); // Ensure real-time is off
        } else if (label === "Datei hochladen") {
            setShowRecorder(false);
            setIsRealtimeActive(false); // Ensure real-time is off
        } else if (label === "Echtzeit") {
            setShowRecorder(false);
            setIsRealtimeActive(true); // triggers <RealtimeTranscription />
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
    // moved, see utils/promptGenerator.ts

    const handleSparkleClick = async () => {
        // V V V Use the edited state here V V V
        const cleanedContent = cleanupQuillHtmlSimple(currentEditedTranscription); // <<< Use the simple helper
        // --->>> STEP 2: Add a console log right after cleanup <<<---
        console.log("Content BEFORE sending to AI:", currentEditedTranscription);
        console.log("Content AFTER cleanup, BEFORE sending to AI:", cleanedContent); // <<< CHECK THIS LOG

        // Check the cleaned content
        if (!cleanedContent) return;

        try {
            setSparkleLoading(true);
            setSparkleResponse("");

            const systemPrompt = generateSystemPrompt(aiParamsState);

            const messages = [
                { role: "system", content: systemPrompt },
                // --->>> STEP 3: Ensure cleanedContent is used here <<<---
                { role: "user", content: cleanedContent },
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
    const renderDiff = (original: string | null, changed: string | null): React.ReactNode => {
        // 1. Strip HTML from both input strings FIRST
        const strippedOriginal = stripHtml(original);
        const strippedChanged = stripHtml(changed);

        // 2. Perform the diff on the PLAIN TEXT versions
        const diff = diffWords(strippedOriginal, strippedChanged);

        // 3. Map over the plain text diff results and apply styles
        return (
            // Wrap in a div to contain the spans, apply text style if needed
            <div className="text-xs font-light leading-relaxed whitespace-pre-wrap">
                {diff.map((part, idx) => {
                    let style = "";
                    if (part.added) style = "bg-green-200";
                    if (part.removed) style = "bg-red-200 line-through";

                    // Render the plain text part value within the span
                    return <span key={idx} className={style}>{part.value}</span>;
                })}
            </div>
        );
    }; // End of renderDiff function

    // Word-Download für KI-Version - SIMPLIFIED
    const downloadSparkleAsWord = async () => {
        if (!sparkleResponse) return;
        await generateDocx(
            sparkleResponse,
            "/forms/Blank/Briefkopf_blank.docm", // Template path
            "Transkription_KI.docm"              // Output filename
        );
    };

    // Word-Download für Original - SIMPLIFIED
    const downloadOriginalAsWord = async () => {
        const cleanedContent = cleanupQuillHtmlSimple(currentEditedTranscription); // <<< Use the simple help
        // V V V Use the edited state here V V V
        if (!cleanedContent) return;
        await generateDocx(
            // V V V Use the edited state here V V V
            cleanedContent,
            "/forms/Blank/Briefkopf_blank.docm", // Template path
            "Transkription_Original.docm"        // Output filename
        );
    };


    // Simpler function - USE WITH CAUTION (Assumes NO other HTML formatting)
    const cleanupQuillHtmlSimple = (html: string | null): string => {
        if (!html) return ''; // Handle null or empty input

        const trimmedHtml = html.trim();

        // Use regex: ^ matches start, $ matches end
        // Replace leading <p> if present
        let cleaned = trimmedHtml.replace(/^<p>/, '');
        // Replace trailing </p> if present
        cleaned = cleaned.replace(/<\/p>$/, '');

        return cleaned;
    };

    // --- Render JSX (mostly unchanged, ensure imports/paths are correct) ---
    return (
        <div className="flex flex-col md:flex-row bg-gray-100" style={{ minHeight: "90vh" }}>
            {/* Sidebar */}
            <TranscriptSidebar
                previousTranscriptions={previousTranscriptions}
                //loadTranscription={(text) => setTranscription(text)} // Keep loading into main view state
                loadTranscription={(text) => {
                    setTranscription(text); // Keep this
                    setCurrentEditedTranscription(text); // <<< Add this line
                }}
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
                            <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-4 min-h-[220px] flex flex-col items-center justify-center space-y-4">
                                <div className="relative inline-flex">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        accept="audio/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-md shadow transition-colors flex items-center gap-2 text-sm font-semibold"
                                    >
                                        <span className="text-lg">📂</span>
                                        Audio hochladen
                                    </label>
                                </div>
                            </div>



                            {audioBlob && (
                                <div className="text-center">
                                    {/* Audio preview box */}
                                    <div className="p-4 bg-gray-50 rounded-lg mb-4">
                                        <p className="text-sm text-gray-600 mb-2">Audiodatei bereit für Transkription</p>
                                        <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
                                    </div>

                                    {/* Centered action buttons */}
                                    <div className="inline-flex space-x-2 mt-2">
                                        <button
                                            onClick={transcribeAudio}
                                            disabled={loadingFileTranscription}
                                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-md shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loadingFileTranscription ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4 text-gray-200" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                                                    </svg>
                                                    <span className="text-sm text-gray-600 ">Transkribiere...</span>
                                                </>

                                            ) : (
                                                <>
                                                    <CommandLineIcon className="h-5 w-5 text-white" />
                                                    <span className="text-sm">Audio transkribieren</span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => downloadBlob(audioBlob, 'aufnahme.wav')}
                                            className="flex items-center gap-2 border border-gray-400 text-gray-600 hover:bg-gray-100 px-5 py-2.5 rounded-md text-sm transition-colors"
                                            title="Aufgenommene Audiodatei herunterladen"
                                        >
                                            ⬇️ Audio herunterladen
                                        </button>

                                        {/* --- API Engine Toggle Button --- */}
                                        {/* Only show toggle if not in Realtime mode */}
                                        {!isRealtimeActive && (
                                            <button
                                                onClick={cycleEngine}
                                                className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-400 text-gray-600 hover:bg-gray-100 rounded-md text-sm transition-colors shadow"
                                                title={`Transkriptions-Engine wechseln. Aktuell: ${currentEngine.label}`}
                                            >
                                                <ArrowPathIcon className="h-4 w-4 text-gray-500" />
                                                Engine: <span className="font-semibold">{currentEngine.label}</span>
                                            </button>

                                        )}

                                    </div>
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
                                    <div className="inline-flex space-x-2">
                                        <button
                                            onClick={transcribeAudio}
                                            disabled={loadingFileTranscription}
                                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-md shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loadingFileTranscription ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                                                    </svg>
                                                    <span className="text-sm">Transkribiere...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CommandLineIcon className="h-5 w-5 text-white" />
                                                    <span className="text-sm">Audio transkribieren</span>
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={() => downloadBlob(audioBlob, 'aufnahme.wav')}
                                            className="flex items-center gap-2 border border-gray-400 text-gray-600 hover:bg-gray-100 px-5 py-2.5 rounded-md text-sm transition-colors"
                                            title="Aufgenommene Audiodatei herunterladen"
                                        >
                                            ⬇️ Audio herunterladen
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Echtzeit mode */}
                    {isRealtimeActive && (
                        <RealtimeTranscription
                            isActive={isRealtimeActive}
                            setIsActive={setIsRealtimeActive}
                            realtimeText={realtimeText}
                            setRealtimeText={setRealtimeText}
                            handleNewTranscription={handleNewTranscription}
                            setError={setError}
                            primaryColor={primaryColor}
                            modelName="Azure Speech (webkitSpeechRecognition)" // fix fo dynamic
                        />



                    )}

                    {!loggerReady && isRealtimeActive && (
                        <p>Logger wird initialisiert – bitte kurz warten…</p>
                    )}



                    {/* Error msg */}
                    {error && (<div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg"> <p className="flex items-center gap-2"> <span className="text-xl">⚠️</span> {error} </p> </div>)}

                    {/* === Final Transcription Display Area === */}
                    {transcription && !isRealtimeActive && (
                        <div className="mt-6">
                            <div className="flex flex-col md:flex-row gap-4" style={{ minHeight: '400px' }}>

                                {/* Use the Original Display Component */}
                                <OriginalTranscriptionDisplay
                                    value={currentEditedTranscription} // <<< Add this
                                    // Add onChange prop:
                                    onChange={handleTranscriptionEditorChange} // <<< Add this

                                    onDownload={downloadOriginalAsWord}
                                    primaryColor={primaryColor}
                                />

                                {/* Use the KI Display Component */}
                                <KiTranscriptionDisplay
                                    // V V V Pass the EDITED state here V V V
                                    originalTranscription={currentEditedTranscription}
                                    // ^^^^ This is important for the renderDiff function

                                    kiResponse={sparkleResponse}
                                    isLoading={sparkleLoading} // Consider if loadingFileTranscription should also be factored in?
                                    isGenerating={sparkleLoading}
                                    primaryColor={primaryColor}
                                    aiParameterDefinitions={aiParameterDefinitions}
                                    currentAiParams={aiParamsState}
                                    onAiParamChange={handleAiParamChange}
                                    onGenerateKi={handleSparkleClick}
                                    onDownloadKi={downloadSparkleAsWord}
                                    renderDiff={renderDiff}
                                />

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
