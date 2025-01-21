import React, { useState } from "react";

type VoicePickerProps = {
    onVoiceSelect: (voice: string) => void; // Callback to pass the selected voice
};

const VoicePicker: React.FC<VoicePickerProps> = ({ onVoiceSelect }) => {
    const [selectedVoice, setSelectedVoice] = useState<string>("ash"); // Default voice

    const voices = [
        "alloy",
        "ash",
        "ballad",
        "coral",
        "echo sage",
        "shimmer",
        "verse",
    ];

    const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVoice(e.target.value);
    };

    const handleConfirm = () => {
        onVoiceSelect(selectedVoice); // Pass the selected voice to the parent
    };

    return (
        <div className="p-4 border border-gray-300 rounded bg-gray-50 w-full max-w-md mx-auto">
            <h2 className="text-lg font-medium mb-4">Select a Voice</h2>
            <div className="flex flex-col space-y-2">
                <select
                    value={selectedVoice}
                    onChange={handleVoiceChange}
                    className="p-2 border rounded bg-white"
                >
                    {voices.map((voice) => (
                        <option key={voice} value={voice}>
                            {voice.charAt(0).toUpperCase() + voice.slice(1)}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleConfirm}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Stimme bestätigen
                </button>
            </div>
        </div>
    );
};

export default VoicePicker;
