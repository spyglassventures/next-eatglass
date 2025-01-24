'use client';
// hiding
// see /src/components/AI/ModelSelector.tsx and src/components/AI/FilterContext.tsx asrc/components/AI/FilterContext.tsx
// state is passed from button change in mpa, arzt, pro to local storage, then read by FilterContext.tsx, then imported by chat_ component.

import React, { useRef, useEffect, useState } from 'react';

interface ModelSelectorProps {
    modelPath: string;
    onModelChange: (value: string) => void;
}

const models = [
    { value: '/api/chat-35', label: 'GPT-3.5' },
    { value: '/api/chat-4o-mini', label: 'GPT-4-Mini' },
    { value: '/api/chat-4o', label: 'GPT-4o' },
    { value: '/api/chat-o1-preview', label: 'GPT-o1-preview (1-3 Min. warten)' },
    { value: '/api/anthropic-claude-3-5', label: 'Claude 3.5' },
    { value: '/api/chat-o3-preview', label: 'GPT-o3-preview coming soon' },
    // { value: '/api/whisper', label: 'Whisper' },
    // { value: '/api/realtime', label: 'Realtime' }, // could be with Twilio
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ modelPath, onModelChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [sliderStyle, setSliderStyle] = useState({ width: '0px', left: '0px' });

    useEffect(() => {
        if (containerRef.current) {
            const buttons = Array.from(containerRef.current.querySelectorAll('button'));
            const activeIndex = models.findIndex((model) => model.value === modelPath);

            if (buttons[activeIndex]) {
                const activeButton = buttons[activeIndex] as HTMLElement;
                setSliderStyle({
                    width: `${activeButton.offsetWidth}px`,
                    left: `${activeButton.offsetLeft}px`,
                });
            }
        }
    }, [modelPath]);

    return (
        <div ref={containerRef} className="relative inline-flex items-center bg-gray-100 rounded-full p-0.5 shadow-sm">
            {/* Animated Background */}
            <div
                className="absolute bg-gray-300 rounded-full transition-all duration-300"
                style={{
                    width: sliderStyle.width,
                    left: sliderStyle.left,
                    height: '100%',
                }}
            ></div>

            {/* Buttons */}
            {models.map((model) => (
                <button
                    key={model.value}
                    onClick={() => onModelChange(model.value)}
                    className={`relative z-3 text-[10px] px-3 py-1 font-medium transition-colors duration-300 ${modelPath === model.value ? 'text-black' : 'text-gray-600 hover:text-black'
                        }`}
                >
                    {model.label}
                </button>
            ))}
        </div>
    );
};

export default ModelSelector;
