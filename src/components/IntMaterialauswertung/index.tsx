'use client';

import React, { useState } from 'react';
import { XMLParser } from 'fast-xml-parser';
import MaterialTabelle, { MaterialItem } from './MaterialTabelle';
import SystemTabs from './SystemTabs';

const Materialauswertung = () => {
    const [data, setData] = useState<MaterialItem[]>([]);
    const [filter, setFilter] = useState<string>('');
    const [currentSystem, setCurrentSystem] = useState('Vitodata');
    const [isAvailable, setIsAvailable] = useState(true);
    const [selectedExample, setSelectedExample] = useState<number | null>(null); // ⬅️ NEW

    const [activeTags, setActiveTags] = useState<string[]>([]);


    const parseXMLContent = (xml: string) => {
        const parser = new XMLParser({ ignoreAttributes: false });
        const parsed = parser.parse(xml);
        const rows = parsed.Workbook.Worksheet.Table.Row;
        const headers = rows[0].Cell.map((c: any) => c.Data['#text']);
        const content = rows.slice(1).map((row: any) => {
            const item: any = {};
            row.Cell.forEach((cell: any, i: number) => {
                const value = cell?.Data?.['#text'] || '';
                const key = headers[i];
                item[key] = value;
            });
            return item as MaterialItem;
        });
        setData(content);
    };

    const toggleTag = (tag: string) => {
        setActiveTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };


    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const text = await file.text();
        setSelectedExample(null); // ⬅️ Reset example selection
        parseXMLContent(text);
    };

    const loadExample = async (index: number) => {
        const res = await fetch(`/data/Material/Vitodata/VitodataBeispielMaterial${index}.xml`);
        const text = await res.text();
        setSelectedExample(index); // ⬅️ Mark selected
        parseXMLContent(text);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-secondary to-indigo-100 dark:from-gray-800 dark:to-gray-900 text-black dark:text-white">
            <div className="container mx-auto py-16 px-6 md:px-12 lg:px-24 text-center">

                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                    Diese Funktion ermöglicht Ihnen, Material-Statistiken zu exportieren und hier zu analysieren.
                </p>

                <SystemTabs onSystemChange={(name, available) => {
                    setCurrentSystem(name);
                    setIsAvailable(available);
                    setData([]);
                    setSelectedExample(null);
                }} />

                {isAvailable && (
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer px-5 py-2 bg-primary text-white rounded-full hover:bg-[color-mix(in srgb, var(--color-primary) 85%, black)] transition-transform duration-300"
                        >
                            📁 Datei auswählen
                            <input
                                id="file-upload"
                                type="file"
                                accept=".xml"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </label>

                        <button
                            onClick={() => loadExample(1)}
                            className={`px-5 py-2 rounded-full transition-transform duration-300 ${selectedExample === 1
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            Beispiel 1: Bort
                        </button>
                        <button
                            onClick={() => loadExample(2)}
                            className={`px-5 py-2 rounded-full transition-transform duration-300 ${selectedExample === 2
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                        >
                            Beispiel 2: Jahresverbrauch
                        </button>
                    </div>
                )}

                {data.length > 0 && (
                    <>
                        <div className="mb-4 text-sm text-gray-600 italic">
                            Aktive Filter: {activeTags.join(', ')}
                        </div>
                        <div className="mb-4 flex flex-wrap justify-center items-center gap-2">
                            {/* Toggle Buttons */}
                            {['BORT', 'Bauerfeind'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-4 py-1 text-sm rounded-full border transition-colors duration-200 ${activeTags.includes(tag)
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-primary border-primary hover:bg-primary hover:text-white'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}

                            {/* Custom Tag Input */}
                            <input
                                type="text"
                                placeholder="🔎 eigenes Schlagwort"
                                className="px-4 py-1 text-sm rounded-full border border-primary text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const val = (e.target as HTMLInputElement).value.trim();
                                        if (val && !activeTags.includes(val)) {
                                            toggleTag(val);
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }
                                }}
                            />

                            {/* Reset */}
                            {(activeTags.length > 0 || filter.length > 0) && (
                                <button
                                    onClick={() => {
                                        setActiveTags([]);
                                        setFilter('');
                                    }}
                                    className="px-4 py-1 text-sm bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
                                >
                                    🔄 Filter zurücksetzen
                                </button>
                            )}
                        </div>



                        <input
                            type="text"
                            placeholder="Suche nach Produkt oder Titel..."
                            className="mb-6 px-4 py-2 border rounded-full w-full max-w-md text-black"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />

                        <MaterialTabelle data={data} filter={filter} tags={activeTags} />
                    </>
                )}

            </div>
        </div>
    );
};

export default Materialauswertung;
