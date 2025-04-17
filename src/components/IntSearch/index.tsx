'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function IntSearch() {
    const [query, setQuery] = useState('');
    const [answer, setAnswer] = useState('');
    const [renderedHtml, setRenderedHtml] = useState('');
    const [sources, setSources] = useState<{ uri: string; title: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    function withTargetBlank(html: string) {
        return html.replace(/<a\s/g, '<a target="_blank" rel="noopener noreferrer" ');
    }

    const handleSearch = async () => {
        setLoading(true);
        setAnswer('');
        setRenderedHtml('');
        setSources([]);
        setError('');

        try {
            const res = await fetch('/api/gemini-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: query }],
                }),
            });

            const text = await res.text();
            let parsed;
            try {
                parsed = JSON.parse(text);
            } catch {
                parsed = { text };
            }

            setAnswer(parsed.text || text);
            setRenderedHtml(parsed.renderedHtml || '');
            setSources(parsed.sources || []);
        } catch (err) {
            setError('Fehler bei der Anfrage.');
        }

        setLoading(false);
    };

    return (
        <div className="bg-white p-4 shadow-md rounded-lg space-y-6 max-w-2xl mx-auto">
            <div className="flex space-x-2">
                <input
                    type="text"
                    className="flex-1 border px-3 py-2 rounded-md"
                    placeholder="Frag etwas (z. B. 'Wer gewann Wimbledon 2024?')"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    onClick={handleSearch}
                    disabled={loading || !query.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    {loading ? 'Lädt...' : 'Suchen'}
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {answer && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Google Suche (Echtzeit) + KI Antwort</h2>
                    <ReactMarkdown
                        components={{
                            p: ({ node, ...props }) => <p className="mb-2 text-gray-800" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-2" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                        }}
                    >
                        {answer}
                    </ReactMarkdown>

                </div>
            )}


            {renderedHtml && (
                <div>
                    <h3 className="text-md font-medium text-gray-800 mb-1">🔍 Google-Suchvorschläge</h3>
                    <div
                        className="border rounded p-3 bg-slate-50 overflow-auto max-h-40"
                        dangerouslySetInnerHTML={{ __html: withTargetBlank(renderedHtml) }}
                    />
                </div>
            )}

            {sources?.length > 0 && (
                <div>
                    <h3 className="text-md font-medium text-gray-800 mb-2">📚 Quellen</h3>
                    <div className="flex flex-wrap gap-2">
                        {sources.map((source, index) => (
                            <a
                                key={index}
                                href={source.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm px-3 py-1 rounded-full transition"
                            >
                                {source.title || 'Quelle ansehen'}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
