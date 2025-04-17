"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import ChatInput from "./ChatInput";
import { FaCopy } from "react-icons/fa";

// PDF.js worker setup
pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs";

export default function PdfChat() {
    const [files, setFiles] = useState<File[]>([]);
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState<{ prompt: string; answer: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [copyMessage, setCopyMessage] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeFileIndex, setActiveFileIndex] = useState(0);

    const [statusMessage, setStatusMessage] = useState<string | null>(null);


    const MAX_TOTAL_MB = 4.5; // Vercel Limit on Edge
    const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024;

    const handleValidatedFileUpload = (selectedFiles: File[] | null) => {
        if (!selectedFiles || selectedFiles.length === 0) {
            setFiles([]);
            setSelectedFileName(null);
            setActiveFileIndex(0);
            return;
        }

        const pdfs = selectedFiles.filter(f => f.type === "application/pdf");
        const totalSize = pdfs.reduce((sum, f) => sum + f.size, 0);

        if (totalSize > MAX_TOTAL_BYTES) {
            alert(`❌ Die Dateien sind zusammen zu groß. Bitte laden Sie maximal ${MAX_TOTAL_MB} MB hoch.`);
            return;
        }

        setFiles(pdfs);
        setSelectedFileName(pdfs.map((f) => f.name).join(", "));
        setNumPages(null);
        setActiveFileIndex(0);
    };


    const pdfContainerRef = useRef<HTMLDivElement>(null);
    const dropAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (files.length > 0) {
            const url = URL.createObjectURL(files[activeFileIndex]);
            setPdfUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [files, activeFileIndex]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleValidatedFileUpload(Array.from(e.target.files));
        }
    };

    const handleDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer?.files) {
            handleValidatedFileUpload(Array.from(e.dataTransfer.files));
        }
    }, []);



    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const askQuestion = async () => {
        if (files.length === 0 || !prompt) return;


        setLoading(true);
        setStatusMessage("📤 PDF(s) werden hochgeladen...");
        const startTime = Date.now();

        const formData = new FormData();
        files.forEach(file => {
            formData.append("files", file);
        });
        formData.append("prompt", prompt);

        try {
            console.log("📤 Uploading files:", files.map(f => f.name));
            const res = await fetch("/api/chatwithpdf", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            setStatusMessage("🧠 Analyse gestartet (bis zu 35 Sek.)...");
            const data = await res.json();

            const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
            console.log(`✅ Antwort erhalten nach ${durationSec}s`);
            setStatusMessage(`✅ Antwort nach ${durationSec} Sekunden erhalten`);

            setMessages(prev => [...prev, { prompt, answer: data.answer }]);
            setPrompt("");
        } catch (error) {
            console.error("❌ Fehler während der Analyse:", error);
            alert("Ein Fehler ist aufgetreten. Bitte später erneut versuchen.");
            setStatusMessage("❌ Fehler bei der Verarbeitung");
        } finally {
            setLoading(false);
            setTimeout(() => setStatusMessage(null), 8000); // hide status after 8s
        }
    };




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
            dropArea.addEventListener("dragover", handleDragOver);
            dropArea.addEventListener("drop", handleDrop);
            dropArea.addEventListener("dragleave", handleDragLeave);

            return () => {
                dropArea.removeEventListener("dragover", handleDragOver);
                dropArea.removeEventListener("drop", handleDrop);
                dropArea.removeEventListener("dragleave", handleDragLeave);
            };
        }
    }, [handleDrop, handleDragOver, handleDragLeave]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopyMessage("Antwort kopiert!");
        setTimeout(() => setCopyMessage(null), 2000);
    };

    const shortenName = (name: string, maxLength = 25) => {
        return name.length > maxLength
            ? name.slice(0, maxLength / 2) + "..." + name.slice(-8)
            : name;
    };


    return (
        <div className="flex h-screen">
            <div className="flex flex-col w-1/2 p-6">
                <h1 className="text-2xl font-bold mb-4">💬 Chat mit PDF-Dateien</h1>

                <p className="text-sm text-gray-600 mb-2">
                    ⚠️ Bitte nur PDF-Dateien (in Summe) bis maximal 4.5 MB hochladen.
                </p>

                <div
                    ref={dropAreaRef}
                    className={`border-2 border-dashed rounded-md text-center cursor-pointer ${isDragging ? "border-blue-500 bg-blue-100" : ""
                        } ${files.length === 0 ? "p-8" : "p-36"}`}
                >
                    {files.length > 0 ? (
                        <span>{selectedFileName}</span>
                    ) : (
                        <span>PDFs hierhin ziehen oder hochladen</span>
                    )}
                    <input
                        type="file"
                        accept="application/pdf"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {copyMessage && <div className="text-green-500 mt-2">{copyMessage}</div>}

                {messages.length > 0 && (
                    <div className="pt-2 space-y-4 flex-grow overflow-y-auto">
                        {messages.map((m, idx) => (
                            <Message key={idx} prompt={m.prompt} answer={m.answer} onCopy={() => handleCopy(m.answer)} />
                        ))}
                    </div>
                )}

                {loading && <div className="mt-3 text-gray-500">Laden...</div>}
                {statusMessage && (
                    <div className="mt-3 text-blue-600 font-medium">{statusMessage}</div>
                )}


                <ChatInput
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onSendMessage={askQuestion}
                    onFileUpload={handleValidatedFileUpload}
                    isSending={loading}
                    selectedFileName={selectedFileName}
                />



            </div>

            {pdfUrl && (
                <div className="w-1/2 p-6 overflow-y-auto" ref={pdfContainerRef}>
                    <h2 className="text-xl font-semibold mb-2">PDF-Vorschau</h2>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-4 overflow-x-auto text-xs">
                        {files.map((file, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveFileIndex(index)}
                                className={`px-2 py-1 rounded-md text-xs border ${index === activeFileIndex
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-gray-100 text-gray-700 border-gray-300"
                                    }`}
                            >
                                {shortenName(file.name)} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </button>
                        ))}
                    </div>

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

function Message({
    prompt,
    answer,
    onCopy,
}: {
    prompt: string;
    answer: string;
    onCopy: () => void;
}) {
    return (
        <div className="bg-gray-100 p-4 rounded-lg relative">
            <p className="font-semibold">Q: {prompt}</p>
            <p>A: {answer}</p>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onCopy}>
                <FaCopy />
            </button>
        </div>
    );
}
