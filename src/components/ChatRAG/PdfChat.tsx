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


    const MAX_TOTAL_MB = 40; // Vercel Limit on Edge
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
        try {
            setLoading(true);
            setStatusMessage("📤 PDF(s) werden zu Azure hochgeladen...");

            const azureForm = new FormData();
            files.forEach(file => azureForm.append("files", file));

            const azureRes = await fetch("/api/upload-to-azure-blob-pdf", {
                method: "POST",
                body: azureForm,
            });

            if (!azureRes.ok) {
                throw new Error("Azure upload failed");
            }

            const { urls } = await azureRes.json();
            console.log("✅ Azure Upload URLs:", urls);
            setUploadedUrls(urls);

            setStatusMessage("🧠 Frage wird an die KI geschickt...");

            const llmRes = await fetch("/api/chatwithpdfRAG", {
                method: "POST",
                body: JSON.stringify({ prompt, urls }),
                headers: { "Content-Type": "application/json" },
            });

            if (!llmRes.ok) {
                throw new Error("LLM request failed");
            }

            const { answer } = await llmRes.json();
            console.log("✅ KI Antwort:", answer);

            setMessages(prev => [...prev, { prompt, answer }]);
            setPrompt(""); // clear input
            setStatusMessage("✅ Antwort erhalten");
        } catch (error) {
            console.error(error);
            setStatusMessage("❌ Fehler bei der Anfrage.");
        } finally {
            setLoading(false);
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

    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };


    return (
        <div className="flex h-screen">
            <div className="flex flex-col w-1/2 p-6">
                <h1 className="text-2xl font-bold mb-4">💬 Chat mit PDF-Dateien</h1>

                <p className="text-sm text-gray-600 mb-2">
                    ⚠️ Bitte nur PDF-Dateien (in Summe) bis maximal 4.5 MB hochladen.
                </p>

                {/* --- MODIFIED Drop Area --- */}
                <div
                    ref={dropAreaRef}
                    onClick={triggerFileInput} // Make the whole area clickable
                    className={`border-2 border-dashed rounded-md text-center cursor-pointer transition-all duration-200 ease-in-out ${ // Added transition
                        isDragging
                            ? "border-blue-500 bg-blue-100"
                            : "border-gray-300 hover:border-gray-400" // Default/hover border
                        } ${
                        // --- THIS IS THE CORE LOGIC CHANGE for size ---
                        messages.length > 0
                            ? 'p-2 text-sm' // Very small padding if messages exist
                            : files.length > 0
                                ? 'p-4' // Medium padding if files are loaded but no messages yet
                                : 'p-8' // Large padding initially
                        }`}
                >
                    {/* --- This logic changes the text inside --- */}
                    {messages.length > 0 ? (
                        <span>Neue PDFs hierhin ziehen oder klicken</span> // Text when small
                    ) : files.length > 0 ? (
                        <span>{selectedFileName || "Dateien ausgewählt"}</span> // Text when files selected
                    ) : (
                        <span>PDFs hierhin ziehen oder klicken</span> // Initial text
                    )}
                    {/* --- Ensure input has a ref and is hidden --- */}
                    <input
                        ref={fileInputRef} // Attach ref to input (make sure fileInputRef is defined using useRef)
                        id="pdf-upload-input" // Optional: Keep ID if needed elsewhere
                        type="file"
                        accept="application/pdf"
                        multiple
                        onChange={handleFileChange}
                        className="hidden" // Keep it hidden
                    />
                </div>
                {/* --- End of MODIFIED Drop Area --- */}

                {copyMessage && <div className="text-green-500 mt-2">{copyMessage}</div>}

                {uploadedUrls.length > 0 && (
                    <div className="text-xs text-gray-400 mt-2">
                        <p className="mb-1">🪪 Debug-Links (gültig 1h):</p>
                        <ul className="list-disc pl-4">
                            {uploadedUrls.map((url, idx) => (
                                <li key={idx}>
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
                                        {shortenName(files[idx]?.name || `Datei ${idx + 1}`)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

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

                {/* {messages.length > 0 && (
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
                )} */}






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
