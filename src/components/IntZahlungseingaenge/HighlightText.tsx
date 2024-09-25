import React from 'react';

export const HighlightText = ({ text, query }: { text: string, query: string }) => {
    if (!query) return <>{text}</>;

    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <>{text}</>;

    const beforeMatch = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const afterMatch = text.slice(index + query.length);

    return (
        <>
            {beforeMatch}
            <span className="bg-amber-300 rounded px-1 shadow-md border border-amber-500 font-semibold text-amber-900 hover:bg-amber-400 transition-colors duration-200 ease-in-out">
                {match}
            </span>
            {afterMatch}
        </>
    );
};
