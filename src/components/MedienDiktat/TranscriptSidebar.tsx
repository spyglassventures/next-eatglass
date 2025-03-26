// File: components/MedienDiktat/TranscriptSidebar.tsx
"use client";

import React, { useState } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

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
    // State für das Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTranscription, setSelectedTranscription] = useState<Transcription | null>(null);

    // Modal öffnen und den ausgewählten Text festlegen
    const openModal = (item: Transcription) => {
        setSelectedTranscription(item);
        setIsModalOpen(true);
    };

    // Modal schließen
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTranscription(null);
    };

    // Dokument-Download via docxtemplater
    const downloadAsWord = async (text: string) => {
        try {
            // 1. Leere docx-Vorlage anfordern (oder in "public/" ablegen). Hier minimal statisch
            const response = await fetch("/forms/Blank/Briefkopf_blank.docx"); // Pfad anpassen
            const arrayBuffer = await response.arrayBuffer();

            const zip = new PizZip(arrayBuffer);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            doc.setData({ message: text }); // In der Vorlage muss {{message}} existieren
            doc.render();

            const out = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });

            saveAs(out, "Transkription.docx");
        } catch (error) {
            console.error("Error generating docx:", error);
            alert("Fehler beim Generieren des Word-Dokuments.");
        }
    };

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
                                                // Entweder direkt laden, oder Modal öffnen:
                                                // loadTranscription(item.text);
                                                openModal(item);
                                            }
                                        }}
                                        className="hover:text-blue-700 text-xs"
                                        style={{ color: primaryColor }}
                                        title="Transkription anzeigen"
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

            {/* Modal für Detailanzeige */}
            {isModalOpen && selectedTranscription && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white p-6 rounded shadow-lg max-w-lg w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold mb-4" style={{ color: primaryColor }}>
                            Transkription vom {selectedTranscription.date}
                        </h3>
                        <p className="whitespace-pre-wrap text-sm text-gray-800 mb-4">
                            {selectedTranscription.text}
                        </p>

                        {/* Download Word Button */}
                        <button
                            onClick={() => downloadAsWord(selectedTranscription.text)}
                            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow focus:outline-none"
                        >
                            <span className="mr-2 text-lg">📝</span>
                            Als Word herunterladen
                        </button>

                        {/* Schließen */}
                        <button
                            onClick={closeModal}
                            className="ml-4 inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow focus:outline-none"
                        >
                            Schließen
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TranscriptSidebar;
