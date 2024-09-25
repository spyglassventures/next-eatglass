import React from 'react';
import { HighlightText } from './HighlightText';

export const SearchResults = ({ searchResults, searchQuery }: { searchResults: Record<string, any[]>, searchQuery: string }) => {
    if (Object.keys(searchResults).length === 0) {
        return <p>Keine Transaktion gefunden.</p>;
    }

    return (
        <>
            {Object.keys(searchResults).map((file) => (
                <div key={file} className={`mb-4 bg-blue-100`}>
                    <h3 className="font-semibold text-lg">{file}</h3>
                    {searchResults[file].map((result, index) => (
                        <div key={index} className="bg-white p-4 mb-2 shadow-sm rounded-md border border-gray-200">
                            <p><strong>Transaktions ID:</strong> <HighlightText text={result.acctSvcrRef} query={searchQuery} /></p>
                            <p><strong>Betrag:</strong> <HighlightText text={result.amount} query={searchQuery} /></p>
                            <p><strong>Zahlungsreferenz:</strong> <HighlightText text={result.creditorRef} query={searchQuery} /></p>
                            <p><strong>Debtor:</strong> <HighlightText text={result.debtorName} query={searchQuery} /></p>
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
};
