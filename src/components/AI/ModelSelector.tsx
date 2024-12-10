'use client';

import React from 'react';

interface ModelSelectorProps {
    modelPath: string;
    onModelChange: (value: string) => void;
}

const models = [
    { value: '/api/chat-35', label: 'GPT-3.5' },
    { value: '/api/chat-4o-mini', label: 'GPT-4-Mini' },
    { value: '/api/chat-4o', label: 'GPT-4o' },
    { value: '/api/chat-o1-preview', label: 'GPT-o1-preview (1-3 Min. warten)' },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ modelPath, onModelChange }) => {
    return (
        <div className="text-xs text-gray-400 mb-0 pl-1">
            <span className="mr-2">KI-Model Empfehlung:</span>
            {models.map((model) => (
                <button
                    key={model.value}
                    onClick={() => onModelChange(model.value)}
                    className={`px-2 py-0.5 rounded ${modelPath === model.value
                        ? 'bg-gray-200 text-gray-400'
                        : 'hover:underline hover:text-gray-600'
                        }`}
                >
                    {model.label}
                </button>
            ))}
        </div>
    );
};

export default ModelSelector;
