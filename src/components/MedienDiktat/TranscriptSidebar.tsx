// File: components/MedienDiktat/TranscriptSidebar.tsx
"use client";

import React from "react";

interface Transcription {
    id: string;
    text: string;
    date: string;
}

interface TranscriptSidebarProps {
    previousTranscriptions: Transcription[];
    loadTranscription: (text: string) => void;
    deleteTranscription: (id: string) => void;
    primaryColor: string;
    saveLocal: boolean;
    toggleSaveLocal: () => void;
}

const TranscriptSidebar: React.FC<TranscriptSidebarProps> = ({
    previousTranscriptions,
    loadTranscription,
    deleteTranscription,
    primaryColor,
    saveLocal,
    toggleSaveLocal,
}) => {
    return (
        <div className="w-full md:w-64 lg:w-80 bg-white shadow-md p-4 md:min-h-screen overflow-y-auto">
            <h2 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>
                Vorherige Transkriptionen
            </h2>

            <div className="flex items-center mb-4">
                <input
                    type="checkbox"
                    id="saveLocal"
                    checked={saveLocal}
                    onChange={toggleSaveLocal}
                    className="mr-2"
                />
                <label htmlFor="saveLocal" className="text-sm text-gray-700">
                    Transcript lokal speichern
                </label>
            </div>

            {previousTranscriptions.length === 0 ? (
                <p className="text-gray-500 text-sm italic">Keine vorherigen Transkriptionen vorhanden.</p>
            ) : (
                <div className="space-y-3">
                    {previousTranscriptions.map((item) => (
                        <div
                            key={item.id}
                            className="p-3 bg-gray-50 rounded border hover:border-blue-300 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <p className="text-xs text-gray-500">{item.date}</p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            if (saveLocal) {
                                                loadTranscription(item.text);
                                            }
                                        }}
                                        className="hover:text-blue-700 text-xs"
                                        style={{ color: primaryColor }}
                                        title="Transkription laden"
                                    >
                                        📄
                                    </button>
                                    <button
                                        onClick={() => deleteTranscription(item.id)}
                                        className="text-red-500 hover:text-red-700 text-xs"
                                        title="Transkription löschen"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-3">{item.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TranscriptSidebar;