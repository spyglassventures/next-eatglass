"use client";

import React, { useState, useEffect, useRef } from "react";
import AudioVisualizer from "./AudioVisualizer";
import { startRecording, stopRecording } from "../../app/utils/recordingUtils";

interface AudioRecorderProps {
    onRecordingComplete: (blob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [audioStream]);

    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRecording]);

    const beginRecording = async () => {
        try {
            setError(null);
            setRecordingTime(0);

            const { stream, recorder } = await startRecording();
            setAudioStream(stream);
            recorderRef.current = recorder;
            setIsRecording(true);
        } catch (err) {
            console.error("Failed to start recording:", err);
            setError("Zugriff auf das Mikrofon nicht möglich. Bitte stellen Sie sicher, dass Sie die Berechtigung erteilt haben.");
        }
    };

    const finishRecording = () => {
        if (!isRecording) return;

        if (recorderRef.current) {
            stopRecording(recorderRef.current, (blob: Blob) => {
                onRecordingComplete(blob);
            });
        }

        if (audioStream) {
            audioStream.getTracks().forEach(track => track.stop());
        }

        setIsRecording(false);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col items-center gap-4">
                {audioStream && isRecording && <AudioVisualizer stream={audioStream} />}

                <div className="text-2xl font-mono">{formatTime(recordingTime)}</div>

                <div className="flex gap-4">
                    {!isRecording ? (
                        <button
                            onClick={beginRecording}
                            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white w-16 h-16 rounded-full shadow-lg transition-all"
                        >
                            <span className="text-2xl">🎤</span>
                        </button>
                    ) : (
                        <button
                            onClick={finishRecording}
                            className="flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white w-16 h-16 rounded-full shadow-lg transition-all"
                        >
                            <span className="text-2xl">⏹️</span>
                        </button>
                    )}
                </div>

                <p className="text-sm text-gray-500">
                    {isRecording
                        ? "Aufnahme läuft. Klicken Sie auf die Stopptaste, wenn Sie fertig sind."
                        : "Klicken Sie auf die Mikrofontaste, um die Aufnahme zu starten."}
                </p>

                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </div>
        </div>
    );
};

export default AudioRecorder;
