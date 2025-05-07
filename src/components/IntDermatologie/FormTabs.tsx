import React from 'react';

interface FormTabsProps<T extends string> {
    options: readonly T[];
    selected: T;
    onSelect: (v: T) => void;
}

function FormTabs<T extends string>({ options, selected, onSelect }: FormTabsProps<T>) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map(o => (
                <button
                    key={o}
                    type="button"
                    onClick={() => onSelect(o)}
                    className={`px-3 py-1 rounded border ${selected === o
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-700 border-gray-300'
                        }`}
                >
                    {o}
                </button>
            ))}
        </div>
    );
}

export default FormTabs;
