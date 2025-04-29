// File: components/MedienDiktat/AiParameterBox.tsx
import React from 'react';
// Import the shared types/definitions
import { AiParameterConfig, AiPromptParams } from '../../app/utils/promptGenerator'; // Adjust path




interface AiParameterBoxProps {
    parameterDefs: AiParameterConfig[]; // Array of definitions
    currentParams: AiPromptParams; // Current state object
    onParamChange: (paramId: keyof AiPromptParams, checked: boolean) => void; // Single handler
    primaryColor: string;
    // Remove old individual props if they existed
}

const AiParameterBox: React.FC<AiParameterBoxProps> = ({
    parameterDefs,
    currentParams,
    onParamChange,
    primaryColor,
}) => {
    return (
        <div className="p-3 border rounded bg-blue-50 mb-4 border-blue-200">
            <h3 className="font-semibold text-sm mb-2" style={{ color: primaryColor }}>
                KI-Anweisungen
            </h3>
            <div className="space-y-1">
                {/* Loop through definitions to create checkboxes */}
                {parameterDefs.map((param) => (
                    <div key={param.id}>
                        <label className="flex items-center text-xs text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                // Get checked state from the currentParams object
                                checked={currentParams[param.id] ?? false}
                                // Call the single handler with the param ID and new state
                                onChange={(e) => onParamChange(param.id, e.target.checked)}
                                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            {param.label} {/* Use label from definition */}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AiParameterBox;