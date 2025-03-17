import React, { useState, useRef, useEffect } from "react";

interface ChatInputProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    onSendMessage: () => void;
    onFileUpload?: (file: File | null) => void;
    isSending?: boolean;
    selectedFileName?: string | null | undefined;
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
    const [localSelectedFileName, setLocalSelectedFileName] = useState<string | null>(propSelectedFileName ?? null);

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
            const file = e.target.files[0];
            setLocalSelectedFileName(file.name);
            if (onFileUpload) {
                onFileUpload(file);
            }
        } else {
            setLocalSelectedFileName(null);
            if (onFileUpload) {
                onFileUpload(null);
            }
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const clearFileSelection = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setLocalSelectedFileName(null);
        if (onFileUpload) {
            onFileUpload(null);
        }
    };

    return (
        <div className="mt-4">
            <div className="flex gap-2">
                <input
                    className="flex-1 border p-3 rounded-lg shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Stellen Sie Fragen zu diesem PDF (Shift+Enter um in die nächste Zeile zu springen)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSending}
                />
                <button
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${isSending ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    onClick={onSendMessage}
                    disabled={isSending}
                >
                    {isSending ? "Senden..." : "Senden"}
                </button>
            </div>
            <div className="mt-2 flex items-center gap-2">
                <button
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm"
                    onClick={handleButtonClick}
                    disabled={isSending}
                >
                    {localSelectedFileName ? "Andere Datei wählen" : "PDF hochladen"}
                </button>
                <input
                    type="file"
                    accept=".pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSending}
                />
                {localSelectedFileName && (
                    <div className="flex items-center gap-1">
                        <span className="text-sm truncate max-w-[150px]">{localSelectedFileName}</span>
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={clearFileSelection}
                            disabled={isSending}
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