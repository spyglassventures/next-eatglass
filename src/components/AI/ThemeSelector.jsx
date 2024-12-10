'use client';

import React from 'react';

const themes = [
    { value: 'default', label: 'Standard' },
    { value: 'dark', label: 'Dunkel' },
    { value: 'light', label: 'Hell' },
    { value: 'matrix', label: 'Matrix' },
    { value: 'cypherpunk', label: 'Cypherpunk' },
];

const ThemeSelector = ({ setTheme, currentTheme }) => {
    return (
        <div className="text-xs text-gray-400 mb-2 pl-1">
            <span className="mr-2">Theme:</span>
            {themes.map((theme) => (
                <button
                    key={theme.value}
                    onClick={() => setTheme(theme.value)}
                    className={`px-2 py-0.5 rounded ${currentTheme === theme.value
                        ? 'bg-gray-200 text-gray-400'
                        : 'hover:underline hover:text-gray-600'
                        }`}
                >
                    {theme.label}
                </button>
            ))}
        </div>
    );
};

export default ThemeSelector;
