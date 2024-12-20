import React from 'react';

// Define the type for inputCloudBtn
interface InputCloudProps {
    setInput: (input: string | ((prevInput: string) => string)) => void;
    handlePopEffect: () => void;
    inputCloudBtn: Record<string, string[]>; // Object with string keys and array of string values
    input: string;
    currentTheme?: {
        container?: string;
        fontSize?: string;
        fontWeight?: string;
        stripeEffect?: string;
    };
}

const InputCloud: React.FC<InputCloudProps> = ({
    setInput,
    handlePopEffect,
    inputCloudBtn,
    input,
    currentTheme,
}) => {
    // Return null if inputCloudBtn is not an object or is empty
    if (!inputCloudBtn || Object.keys(inputCloudBtn).length === 0) {
        return null;
    }

    // Build container classes with fallback
    const containerClasses = [
        'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2 rounded-lg w-full overflow-y-auto max-h-screen',
        currentTheme?.container || 'bg-gray-50/25',
        currentTheme?.fontSize || 'text-base',
        currentTheme?.fontWeight || 'font-light',
        currentTheme?.stripeEffect || '',
    ].join(' ');

    // Build button classes with fallback
    const buttonClasses = [
        'px-2 py-1 rounded cursor-pointer text-xs w-full text-left',
        currentTheme?.container || 'bg-gray-50/20',
    ].join(' ');

    return (
        <div className={containerClasses}>
            {Object.entries(inputCloudBtn).map(([category, options], categoryIndex) => (
                <div key={categoryIndex} className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold mb-1 truncate">{category}</h3>
                    {options.map((inputCloudText, optionIndex) => (
                        <div
                            key={optionIndex}
                            className={buttonClasses}
                            onClick={() => {
                                setInput((prevInput) => {
                                    const currentInput = prevInput.trim();
                                    return currentInput
                                        ? `${currentInput}, ${inputCloudText}`
                                        : inputCloudText;
                                });
                                handlePopEffect();
                            }}
                        >
                            {inputCloudText}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default InputCloud;
