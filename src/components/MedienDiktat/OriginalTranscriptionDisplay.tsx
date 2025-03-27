// File: components/MedienDiktat/OriginalTranscriptionDisplay.tsx
import React from 'react';
import Image from 'next/image';

interface Props {
    transcription: string | null;
    onDownload: () => void;
    primaryColor: string;
}

const OriginalTranscriptionDisplay: React.FC<Props> = ({
    transcription,
    onDownload,
    primaryColor,
}) => {
    if (!transcription) return null; // Or some placeholder

    return (
        <div className="w-full md:w-1/2 p-3 border rounded bg-gray-50 overflow-auto flex flex-col">
            <h2 className="font-bold text-md mb-2" style={{ color: primaryColor }}>
                Transkription (Aufnahme)
            </h2>
            <div className="text-xs font-light whitespace-pre-wrap flex-1 leading-relaxed">
                {transcription}
            </div>
            <button
                onClick={onDownload}
                className="mt-3 inline-flex items-center border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out self-start"
                title="Original-Transkription als Word-Datei herunterladen"
            >
                <div className="relative mr-1.5 h-4 w-4">
                    <Image
                        src="/images/brands/Microsoft-Word-Icon-PNG.png"
                        alt="Word Icon"
                        fill
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                Original als Word
            </button>
        </div>
    );
};

export default OriginalTranscriptionDisplay;