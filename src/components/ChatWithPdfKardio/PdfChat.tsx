"use client";

// current API with Gemini

import { useState, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import ChatInput from './ChatInput';
import { FaCopy } from 'react-icons/fa';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`;

export default function PdfChat() {
    const [file, setFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState<{ prompt: string; answer: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const pdfContainerRef = useRef<HTMLDivElement>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const dropAreaRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [copyMessage, setCopyMessage] = useState<string | null>(null);

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPdfUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setNumPages(null);
            setSelectedFileName(e.target.files[0].name);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const askQuestion = async (customPrompt?: string) => {
        const promptToSend = customPrompt ?? prompt;

        if (!file || !promptToSend) return;

        console.log("🧠 Prompt sent to API:\n", promptToSend); // LOG HIER!

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("prompt", promptToSend);

        try {
            const res = await fetch("/api/chatwithpdf", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const data = await res.json();

            setMessages((prev) => [...prev, { prompt: promptToSend, answer: data.answer }]);
            setPrompt("");
        } catch (error) {
            console.error("❌ Error during question processing:", error);
            alert("An error occurred while processing your question.");
        } finally {
            setLoading(false);
        }
    };



    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = e.dataTransfer?.files;
        if (droppedFiles && droppedFiles.length > 0 && droppedFiles[0].type === "application/pdf") {
            setFile(droppedFiles[0]);
            setNumPages(null);
            setSelectedFileName(droppedFiles[0].name);
        }
    }, []);

    const handleDragOver = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    useEffect(() => {
        const dropArea = dropAreaRef.current;
        if (dropArea) {
            dropArea.addEventListener('dragover', handleDragOver);
            dropArea.addEventListener('drop', handleDrop);
            dropArea.addEventListener('dragleave', handleDragLeave);

            return () => {
                dropArea.removeEventListener('dragover', handleDragOver);
                dropArea.removeEventListener('drop', handleDrop);
                dropArea.removeEventListener('dragleave', handleDragLeave);
            };
        }
    }, [handleDrop, handleDragOver, handleDragLeave]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopyMessage('Antwort kopiert!');
        setTimeout(() => setCopyMessage(null), 2000);
    };

    return (
        <div className="flex h-screen">
            <div className="flex flex-col w-1/2 p-6">
                <h1 className="text-2xl font-bold mb-4">Kommentar Holter EKG erstellen</h1>

                <div
                    ref={dropAreaRef}
                    className={`border-2 border-dashed rounded-md text-center cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-100' : ''} ${!file ? 'p-8' : 'p-36'}`}
                >
                    {file ? (
                        <span>{file.name}</span>
                    ) : (
                        <span>PDF hierhin ziehen oder hochladen</span>
                    )}
                </div>

                {copyMessage && <div className="text-green-500 mt-2">{copyMessage}</div>}

                {/* Only render messages container if there are messages */}
                {messages.length > 0 && (
                    <div className="pt-2 space-y-4 flex-grow overflow-y-auto">
                        {messages.map((m, idx) => (
                            <Message
                                key={idx}
                                prompt={m.prompt}
                                answer={m.answer}
                                onCopy={() => handleCopy(m.answer)}
                            />
                        ))}
                    </div>
                )}

                {loading && <div className="mt-3 text-gray-500">Laden...</div>}

                <ChatInput
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onSendMessage={(customPrompt) => {
                        if (!file) {
                            alert("Please select a PDF first.");
                            return;
                        }
                        askQuestion(customPrompt);
                    }}
                    onFileUpload={setFile}
                    isSending={loading}
                    selectedFileName={selectedFileName}
                />

            </div>

            {pdfUrl && (
                <div className="w-1/2 p-6 overflow-y-auto" ref={pdfContainerRef}>
                    <h2 className="text-xl font-semibold mb-2">PDF Preview</h2>
                    <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                        {numPages &&
                            Array.from(new Array(numPages), (_, index) => (
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    width={pdfContainerRef.current?.offsetWidth || 500}
                                />
                            ))}
                    </Document>
                </div>
            )}
        </div>
    );
}


function Message({ answer, onCopy }: { prompt?: string; answer: string; onCopy: () => void }) {
    return (
        <div className="bg-gray-100 p-4 rounded-lg relative whitespace-pre-wrap">
            <p>{answer}</p>
            <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={onCopy}
            >
                <FaCopy />
            </button>
        </div>
    );
}

