// File: components/MedienDiktat/KiTranscriptionDisplay.tsx
import React from 'react';
import Image from 'next/image';
import AiParameterBox from './AiParameterBox'; // Assuming it's in the same directory
import { AiParameterConfig, AiPromptParams } from '../../app/utils/promptGenerator'; // Adjust path

import { useState } from 'react'; // at top if not already




// Define structure for AI parameters and handlers for cleaner props
interface AiParams {
    orthography: boolean;
    language: boolean;
    isMedicalReport: boolean;
    fixInterpretation: boolean;
}

interface AiParamHandlers {
    onOrthographyChange: (checked: boolean) => void;
    onLanguageChange: (checked: boolean) => void;
    onMedicalReportChange: (checked: boolean) => void;
    onFixInterpretationChange: (checked: boolean) => void;
}

interface Props {
    originalTranscription: string | null;
    kiResponse: string;
    isLoading: boolean;
    isGenerating: boolean;
    primaryColor: string;
    // --- Updated Props ---
    aiParameterDefinitions: AiParameterConfig[];
    currentAiParams: AiPromptParams;
    onAiParamChange: (paramId: keyof AiPromptParams, checked: boolean) => void;
    // --- Removed Props ---
    // aiParams: AiParams; // Removed
    // aiParamHandlers: AiParamHandlers; // Removed
    onGenerateKi: () => void;
    onDownloadKi: () => void;
    renderDiff: (original: string, changed: string) => React.ReactNode;
}


function renderBoldMarkdown(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g); // split at **bold**

    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
    });
}




const KiTranscriptionDisplay: React.FC<Props> = ({
    originalTranscription,
    kiResponse,
    isLoading,
    isGenerating,
    primaryColor,
    // --- Updated Props ---
    aiParameterDefinitions,
    currentAiParams,
    onAiParamChange,
    // ---
    onGenerateKi,
    onDownloadKi,
    renderDiff,
}) => {
    const [viewMode, setViewMode] = useState<'diff' | 'full'>('full'); // Default to 'full' is the last entry
    return (
        <div className="w-full md:w-1/2 p-3 border rounded bg-gray-50 overflow-auto flex flex-col">
            {/* Header and Sparkle Button ... */}
            {/* Header for KI Box */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-md" style={{ color: primaryColor }}>
                    Verfeinerte Version (KI)
                </h2>
                <button
                    onClick={onGenerateKi}
                    className="inline-flex items-center px-3 py-1 rounded bg-blue-500 hover:bg-purple-600 hover:animate-pulse text-white text-sm font-medium disabled:opacity-50"
                    disabled={isGenerating || !originalTranscription}
                    title="KI-Verarbeitung starten"
                >
                    {isGenerating ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <span className="mr-1">✨</span>
                    )}
                    KI
                </button>
            </div>

            {/* AI Parameter Box */}
            {/* AI Parameter Box - Pass down the new props */}
            <AiParameterBox
                parameterDefs={aiParameterDefinitions}
                currentParams={currentAiParams}
                onParamChange={onAiParamChange}
                primaryColor={primaryColor}
            // Remove spread of old props: {...aiParams}, {...aiParamHandlers}
            />



            {/* Download KI Version Button */}
            {/* KI Response Tabs */}
            {!isLoading && kiResponse && originalTranscription && (
                <>
                    <div className="flex space-x-2 mb-2">
                        <button
                            onClick={() => setViewMode('diff')}
                            className={`px-3 py-1 text-xs rounded border ${viewMode === 'diff'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                                }`}
                        >
                            Änderungen anzeigen
                        </button>
                        <button
                            onClick={() => setViewMode('full')}
                            className={`px-3 py-1 text-xs rounded border ${viewMode === 'full'
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                                }`}
                        >
                            Korrigierte Version
                        </button>
                    </div>

                    <div className="text-xs font-light whitespace-pre-wrap leading-relaxed">
                        {viewMode === 'diff'
                            ? renderDiff(originalTranscription, kiResponse)
                            : renderBoldMarkdown(kiResponse)}
                    </div>
                </>
            )}

        </div>
    );
};

export default KiTranscriptionDisplay;