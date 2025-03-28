// File: app/medien/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import AudioRecorder from "../../components/Transcribe/AudioRecorder";
import TranscriptSidebar from "@/components/MedienDiktat/TranscriptSidebar";
import AiParameterBox from "@/components/MedienDiktat/AiParameterBox"; // <-- Import the new component
import Image from 'next/image';
import { generateDocx } from '../../app/utils/docxGenerator'; // Adjust path if needed
import { CommandLineIcon } from '@heroicons/react/24/solid';

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
    // --- END CENTRALIZED AI State ---




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
    // moved, see utils/promptGenerator.ts

    const handleSparkleClick = async () => {
        if (!transcription) return;
        try {
            setSparkleLoading(true);
            setSparkleResponse("");

            // Pass the whole state object to the generator function
            const systemPrompt = generateSystemPrompt(aiParamsState);
            console.log("Generated System Prompt:", systemPrompt);

            const messages = [
                { role: "system", content: systemPrompt },
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
        if (!transcription) return;
        await generateDocx(
            transcription,
            "/forms/Blank/Briefkopf_blank.docm", // Template path
            "Transkription_Original.docm"        // Output filename
        );
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

                    {/* === Final Transcription Display Area === */}
                    {transcription && !isRealtimeActive && (
                        <div className="mt-6">
                            <div className="flex flex-col md:flex-row gap-4" style={{ minHeight: '400px' }}>

                                {/* Use the Original Display Component */}
                                <OriginalTranscriptionDisplay
                                    transcription={transcription}
                                    onDownload={downloadOriginalAsWord}
                                    primaryColor={primaryColor}
                                />

                                {/* Use the KI Display Component */}
                                <KiTranscriptionDisplay
                                    originalTranscription={transcription}
                                    kiResponse={sparkleResponse}
                                    isLoading={sparkleLoading}
                                    isGenerating={sparkleLoading}
                                    primaryColor={primaryColor}
                                    // Pass the necessary things for the dynamic box
                                    aiParameterDefinitions={aiParameterDefinitions} // Pass definitions
                                    currentAiParams={aiParamsState} // Pass current state object
                                    onAiParamChange={handleAiParamChange} // Pass the single handler

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
