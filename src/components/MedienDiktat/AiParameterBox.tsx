// File: components/MedienDiktat/AiParameterBox.tsx
import React from 'react';

interface AiParameterBoxProps {
    orthography: boolean;
    language: boolean;
    isMedicalReport: boolean;
    fixInterpretation: boolean;
    onOrthographyChange: (checked: boolean) => void;
    onLanguageChange: (checked: boolean) => void;
    onMedicalReportChange: (checked: boolean) => void;
    onFixInterpretationChange: (checked: boolean) => void;
    primaryColor: string; // To potentially style elements consistently
}

const AiParameterBox: React.FC<AiParameterBoxProps> = ({
    orthography,
    language,
    isMedicalReport,
    fixInterpretation,
    onOrthographyChange,
    onLanguageChange,
    onMedicalReportChange,
    onFixInterpretationChange,
    primaryColor,
}) => {
    return (
        <div className="p-3 border rounded bg-blue-50 mb-4 border-blue-200">
            <h3 className="font-semibold text-sm mb-2" style={{ color: primaryColor }}>
                KI-Anweisungen
            </h3>
            <div className="space-y-1">
                {/* Orthography Checkbox */}
                <div>
                    <label className="flex items-center text-xs text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={orthography}
                            onChange={(e) => onOrthographyChange(e.target.checked)}
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Orthographische Korrektur
                    </label>
                </div>

                {/* Language Checkbox */}
                <div>
                    <label className="flex items-center text-xs text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={language}
                            onChange={(e) => onLanguageChange(e.target.checked)}
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Sprachliche Verbesserung (Stil)
                    </label>
                </div>

                {/* Medical Report Checkbox */}
                <div>
                    <label className="flex items-center text-xs text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isMedicalReport}
                            onChange={(e) => onMedicalReportChange(e.target.checked)}
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Als Arztbericht formatieren
                    </label>
                </div>

                {/* Interpretation Fix Checkbox */}
                <div>
                    <label className="flex items-center text-xs text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={fixInterpretation}
                            onChange={(e) => onFixInterpretationChange(e.target.checked)}
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Kontextbasierte Korrektur (Fehlinterpretationen)
                    </label>
                </div>
            </div>
        </div>
    );
};

export default AiParameterBox;