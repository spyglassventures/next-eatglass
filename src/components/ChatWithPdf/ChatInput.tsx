import React, { useState, useRef, useEffect } from "react";

interface ChatInputProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    onSendMessage: () => void;
    onFileUpload?: (files: File[] | null) => void;
    isSending?: boolean;
    selectedFileName?: string | null;
}

const ChatInput: React.FC<ChatInputProps> = ({
    prompt,
    setPrompt,
    onSendMessage,
    onFileUpload,
    isSending = false,
    selectedFileName: propSelectedFileName,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localSelectedFileName, setLocalSelectedFileName] = useState<string | null>(
        propSelectedFileName ?? null
    );

    useEffect(() => {
        setLocalSelectedFileName(propSelectedFileName ?? null);
    }, [propSelectedFileName]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (prompt.trim()) {
                onSendMessage();
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const names = files.map((f) => f.name).join(", ");
            setLocalSelectedFileName(names);
            onFileUpload?.(files);
        } else {
            setLocalSelectedFileName(null);
            onFileUpload?.(null);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const clearFileSelection = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setLocalSelectedFileName(null);
        onFileUpload?.(null);
    };

    return (
        <div className="mt-4">
            <div className="flex gap-2">
                <input
                    className="flex-1 border p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Stellen Sie Fragen zu den PDFs (Shift+Enter für neue Zeile)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSending}
                />
                <button
                    onClick={onSendMessage}
                    disabled={isSending}
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg shadow-md transition
    focus:outline-none focus:ring-2 focus:ring-blue-400
    ${isSending
                            ? "bg-slate-400 text-black cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }
  `}
                    style={{
                        backgroundColor: isSending ? "#94a3b8" : undefined, // slate-400
                        color: isSending ? "#000000" : undefined,
                        opacity: 1,
                        border: "none",
                        appearance: "none",
                        WebkitAppearance: "none",
                    }}
                >
                    {isSending && (
                        <svg
                            className="w-4 h-4 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            />
                        </svg>
                    )}
                    <span>{isSending ? "Wird gesendet..." : "Senden"}</span>
                </button>








            </div>

            <div className="mt-2 flex items-center gap-2">
                {/* Upload button */}
                <button
                    onClick={handleButtonClick}
                    disabled={isSending}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium shadow-sm transition
    ${isSending
                            ? "text-black bg-slate-300 cursor-not-allowed"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                    style={{
                        backgroundColor: isSending ? "#e6e6e6" : undefined, // Tailwind slate-400
                        color: isSending ? "#e6e6e6" : undefined,
                        opacity: 1,
                        border: "none",
                        appearance: "none",
                        WebkitAppearance: "none",
                    }}
                >
                    {localSelectedFileName ? "Andere Dateien wählen" : "PDFs hochladen"}
                </button>





                {/* Hidden input */}
                <input
                    type="file"
                    accept=".pdf"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSending}
                />

                {/* File name display */}
                {localSelectedFileName && (
                    <div className="flex items-center gap-1">
                        <span className="text-sm truncate max-w-[200px]">
                            {localSelectedFileName.split(",").length > 1
                                ? `${localSelectedFileName.split(",").length} PDFs ausgewählt`
                                : localSelectedFileName}
                        </span>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={clearFileSelection}
                            disabled={isSending}
                            title="Auswahl löschen"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInput;
