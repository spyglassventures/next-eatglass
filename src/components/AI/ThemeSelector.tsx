'use client';

import React, { useRef, useEffect, useState } from 'react';

const themes = [
    { value: 'default', label: 'Standard' },
    { value: 'dark', label: 'Dunkel' },
    { value: 'light', label: 'Hell' },
    { value: 'matrix', label: 'Matrix' },
    { value: 'gulf', label: 'Gulf' },
    { value: 'brumos', label: 'Brumos' },
    { value: 'castrol', label: 'Castrol' },
    { value: 'redbull', label: 'Redbull' },
    { value: 'martini', label: 'Martini' }, // Updated: Martini added
];

interface ThemeSelectorProps {
    setTheme: (value: string) => void;
    currentTheme: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ setTheme, currentTheme }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [sliderStyle, setSliderStyle] = useState({ width: '0px', left: '0px' });

    // Resolve current theme, fallback to default if undefined or invalid
    const resolvedTheme = themes.some((theme) => theme.value === currentTheme)
        ? currentTheme
        : 'default';

    useEffect(() => {
        if (containerRef.current) {
            const buttons = Array.from(containerRef.current.querySelectorAll('button'));
            const activeIndex = themes.findIndex((theme) => theme.value === resolvedTheme);

            if (buttons[activeIndex]) {
                const activeButton = buttons[activeIndex] as HTMLElement;
                setSliderStyle({
                    width: `${activeButton.offsetWidth}px`,
                    left: `${activeButton.offsetLeft}px`,
                });
            }
        }
    }, [resolvedTheme]);

    return (
        <div
            ref={containerRef}
            className="relative inline-flex items-center bg-gray-100 rounded-full p-0.5 shadow-sm"
            style={{ zIndex: 1 }} // Ensure it's below other elements with a higher z-index
        >
            {/* Animated Background */}
            <div
                className="absolute bg-gray-300 rounded-full transition-all duration-300"
                style={{
                    width: sliderStyle.width,
                    left: sliderStyle.left,
                    height: '100%',
                }}
            ></div>

            {/* Theme Buttons */}
            {themes.map((theme) => (
                <button
                    key={theme.value}
                    onClick={() => setTheme(theme.value)}
                    className={`relative z-3 text-[10px] px-3 py-1 font-medium transition-colors duration-300 ${resolvedTheme === theme.value ? 'text-black' : 'text-gray-600 hover:text-black'
                        }`}
                >
                    {theme.label}
                </button>
            ))}
        </div>
    );
};

export default ThemeSelector;
