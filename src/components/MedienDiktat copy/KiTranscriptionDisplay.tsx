// File: components/MedienDiktat/KiTranscriptionDisplay.tsx
import React from 'react';
import Image from 'next/image';
import AiParameterBox from './AiParameterBox'; // Assuming it's in the same directory
import { AiParameterConfig, AiPromptParams } from '../../app/utils/promptGenerator'; // Adjust path


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

            {/* KI Response Area */}
            <div className="flex-1">
                {isLoading && ( // Use general loading state if needed, or rely on isGenerating for sparkle button
                    <div className="text-sm text-gray-500 text-center p-4">KI-Antwort wird generiert...</div>
                )}
                {!isLoading && kiResponse && originalTranscription && (
                    <div className="text-xs font-light whitespace-pre-wrap flex-1 leading-relaxed">
                        {renderDiff(originalTranscription, kiResponse)}
                    </div>
                )}
                {!isLoading && !kiResponse && (
                    <div className="text-sm text-gray-400 text-center p-4 italic">
                        Klicken Sie auf ✨KI, um basierend auf den obigen Anweisungen eine Version zu generieren. Sie können die Korrektur auch mehrmals mit unterschiedlicher Konfiguration wiederholen.
                    </div>
                )}
            </div>

            {/* Download KI Version Button */}
            {!isLoading && kiResponse && (
                <button
                    onClick={onDownloadKi}
                    className="mt-3 inline-flex items-center border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out self-start"
                    title="KI-Version als Word-Datei herunterladen"
                >
                    <div className="relative mr-1.5 h-4 w-4">
                        <Image
                            src="/images/brands/Microsoft-Word-Icon-PNG.png"
                            alt="Word Icon"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    KI als Word
                </button>
            )}
        </div>
    );
};

export default KiTranscriptionDisplay;