// File: components/Transcribe/AudioRecorder.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import AudioVisualizer from "./AudioVisualizer";
import { startRecording, stopRecording } from "../../app/utils/recordingUtils";

interface AudioRecorderProps {
    onRecordingComplete: (blob: Blob) => void;
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

    // RecordRTC-Instanz
    const recorderRef = useRef<any>(null);

    // Cleanup beim Demontieren
    useEffect(() => {
        return () => {
            if (audioStream) {
                audioStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [audioStream]);

    // Aufnahme starten
    const beginRecording = async () => {
        try {
            const { stream, recorder } = await startRecording();
            recorderRef.current = recorder;
            setAudioStream(stream);
            setIsRecording(true);
            setIsPaused(false);
        } catch (err) {
            console.error("Could not start recording", err);
        }
    };

    // Aufnahme stoppen => finalisiert Blob
    const finishRecording = () => {
        if (!isRecording) return;

        if (recorderRef.current) {
            stopRecording(recorderRef.current, (blob) => {
                onRecordingComplete(blob);
            });
        }
        // Mikrofon freigeben
        if (audioStream) {
            audioStream.getTracks().forEach((track) => track.stop());
        }
        setIsRecording(false);
        setIsPaused(false);
        setAudioStream(null);
    };

    // Aufnahme pausieren
    const pauseRecording = () => {
        if (recorderRef.current && !isPaused) {
            recorderRef.current.pauseRecording();
            setIsPaused(true);
        }
    };

    // Aufnahme fortsetzen
    const resumeRecording = () => {
        if (recorderRef.current && isPaused) {
            recorderRef.current.resumeRecording();
            setIsPaused(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-4 min-h-[220px] flex flex-col items-center justify-center space-y-4">
            {!isRecording && (
                <button
                    onClick={beginRecording}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-md shadow transition-colors flex items-center gap-2 text-sm font-semibold"
                >
                    <span className="text-lg">🎤</span>
                    Aufnahme starten
                </button>
            )}

            {isRecording && (
                <>
                    {audioStream && !isPaused && <AudioVisualizer stream={audioStream} />}

                    <div className="flex space-x-3">
                        {!isPaused ? (
                            <button
                                onClick={pauseRecording}
                                className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-md shadow transition-colors flex items-center gap-2 text-sm font-semibold"
                            >
                                <span className="text-lg">⏸</span>
                                Pause
                            </button>
                        ) : (
                            <button
                                onClick={resumeRecording}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-md shadow transition-colors flex items-center gap-2 text-sm font-semibold"
                            >
                                <span className="text-lg">🎤</span>
                                weiter aufnehmen
                            </button>
                        )}

                        <button
                            onClick={finishRecording}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2.5 rounded-md shadow transition-colors flex items-center gap-2 text-sm font-semibold"
                        >
                            <span className="text-lg">⏹</span>
                            Aufnahme beenden
                        </button>
                    </div>
                </>
            )}
        </div>



    );
}
