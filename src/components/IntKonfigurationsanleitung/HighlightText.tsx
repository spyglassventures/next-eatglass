import React from 'react';

interface HighlightTextProps {
    text: string;
    query: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({ text, query }) => {
    if (!query) return <>{text}</>;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return (
        <>
            {parts.filter(part => part).map((part, index) =>
                regex.test(part) ? (
                    <span key={index} className="bg-amber-300 rounded px-1 shadow-md border border-amber-500 font-semibold text-amber-900 hover:bg-amber-400 transition-colors duration-200 ease-in-out">
                        {part}
                    </span>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </>
    );
};

export default HighlightText;
