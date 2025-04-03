'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { generateWordDoc } from './generateWord';

interface RawRow {
    TARMED: string;
    TARMED_TEXT: string;
    TP_AL_TARMED: string;
    TP_TL_TARMED: string;
    TP_TOTAL_TARMED: string;
    NUMBER_TARMED: string;
    TARDOC: string;
    TARDOC_TEXT: string;
    TP_AL_TARDOC: string;
    TP_TL_TARDOC: string;
    TP_TOTAL_TARDOC: string;
    NUMBER_TARDOC: string;
}

interface TardocEntry {
    TARDOC: string;
    TARDOC_TEXT: string;
    TP_AL_TARDOC: string;
    TP_TL_TARDOC: string;
    TP_TOTAL_TARDOC: string;
    NUMBER_TARDOC: string;
}

export interface GroupedItem {
    TARMED: string;
    TARMED_TEXT: string;
    TP_AL_TARMED: string;
    TP_TL_TARMED: string;
    TP_TOTAL_TARMED: string;
    NUMBER_TARMED: string;
    TARDOC_SUM: string;
    TARMED_SUM: string;
    DELTA: string;
    tardoc: TardocEntry[];
}





const TardocTranscription = () => {
    const [groups, setGroups] = useState<GroupedItem[]>([]);


    const loadExampleCSV = async (url: string) => {
        const response = await fetch(url);
        const text = await response.text();

        Papa.parse<RawRow>(text, {
            header: true,
            delimiter: ';',
            skipEmptyLines: true,
            complete: (result) => {
                const data = result.data as RawRow[];
                const grouped = groupData(data);
                setGroups(grouped);
            },
        });
    };

    const [selectedExample, setSelectedExample] = useState<number | null>(null);


    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse<RawRow>(file, {
            header: true,
            delimiter: ';',
            skipEmptyLines: true,
            complete: (result) => {
                const data = result.data as RawRow[];
                const grouped = groupData(data);
                setGroups(grouped);
            },
        });
    };

    const round2 = (value: string | number): string => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(num)) return '0.00';
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const groupData = (rows: RawRow[]): GroupedItem[] => {
        const result: Record<string, GroupedItem> = {};

        for (const row of rows) {
            const key = row.TARMED;
            const tpTarmed = parseFloat(row.TP_TOTAL_TARMED || '0');
            const tpTardoc = parseFloat(row.TP_TOTAL_TARDOC || '0');

            if (!result[key]) {
                result[key] = {
                    TARMED: row.TARMED,
                    TARMED_TEXT: row.TARMED_TEXT,
                    TP_AL_TARMED: round2(row.TP_AL_TARMED),
                    TP_TL_TARMED: round2(row.TP_TL_TARMED),
                    TP_TOTAL_TARMED: round2(row.TP_TOTAL_TARMED),
                    NUMBER_TARMED: row.NUMBER_TARMED,
                    TARDOC_SUM: '0.00',
                    TARMED_SUM: round2(tpTarmed),
                    DELTA: '0.00',
                    tardoc: [],
                };
            }

            if (row.TARDOC) {
                result[key].tardoc.push({
                    TARDOC: row.TARDOC,
                    TARDOC_TEXT: row.TARDOC_TEXT,
                    TP_AL_TARDOC: round2(row.TP_AL_TARDOC),
                    TP_TL_TARDOC: round2(row.TP_TL_TARDOC),
                    TP_TOTAL_TARDOC: round2(row.TP_TOTAL_TARDOC),
                    NUMBER_TARDOC: row.NUMBER_TARDOC,
                });

                const sum = parseFloat(result[key].TARDOC_SUM);
                result[key].TARDOC_SUM = round2(sum + (isNaN(tpTardoc) ? 0 : tpTardoc));
            }
        }

        // Delta berechnen
        for (const key in result) {
            const g = result[key];
            const delta = parseFloat(g.TARDOC_SUM) - parseFloat(g.TARMED_SUM);
            g.DELTA = round2(delta);
        }

        return Object.values(result);
    };

    const totalTARMED = groups.reduce((sum, g) => sum + parseFloat(g.TARMED_SUM), 0);
    const totalTARDOC = groups.reduce((sum, g) => sum + parseFloat(g.TARDOC_SUM), 0);
    const totalDELTA = totalTARDOC - totalTARMED;


    const exampleFiles = [
        { label: '3x Kons, kl. Unt.', file: 'tarmed_volumes_bsp1.csv' },
        { label: 'Kons, Zuschlag, Spez. Beratung, Blutent.', file: 'tarmed_volumes_bsp2.csv' },
        { label: '3x Kons, Zuschlag, Rezept, Röntgen', file: 'tarmed_volumes_bsp3.csv' },
        { label: '2x Kons, Kind, Zuschlag, Notfall B, Inkonv. P.', file: 'tarmed_volumes_bsp4.csv' },
        { label: '2x Kons, Zuschlag, U. Konsilarzt, Kl. Spiro, EKG', file: 'tarmed_volumes_bsp5.csv' },
        { label: '2x Kons, Zuschlag, Kl. Unt. Rtg Tho, Rg. weitere, Sono Wich, Techn. Grundleist.,', file: 'tarmed_volumes_bsp6.csv' },
    ];


    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">TARMED-TARDOC Transcodierung</h1>

            <input
                type="file"
                accept=".csv"
                onChange={handleUpload}
                className="mb-2"
            />

            {/* Hilfetext für nicht erfahrene Nutzer */}
            {/* Hilfetext für nicht erfahrene Nutzer */}
            <div className="text-sm text-gray-700 mb-4 pl-1">
                <strong>So finden Sie Ihre Datei:</strong><br />
                Nach dem Klick auf <span className="font-semibold">&quot;Transcodieren und Download&quot;</span> auf der omat Seite wurde die Datei auf Ihren Computer heruntergeladen.
                Diese befindet sich meist im Ordner <span className="italic">&quot;Downloads&quot;</span> oder auf dem <span className="italic">&quot;Desktop&quot;</span>.<br />
                Klicken Sie oben auf <span className="font-semibold">&quot;Datei auswählen/Choose file&quot;</span> und wählen Sie die heruntergeladene Datei aus.<br />
                Alternativ finden Sie die Datei auch direkt über das <span className="font-semibold">Download-Symbol</span> in Ihrem Browser oben rechts
                <span className="inline-block ml-1 align-middle text-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 inline">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </span>.
            </div>


            <div className="mt-8">
                <p className="text-sm font-semibold mb-2">Klicken Sie die Beispiele um diese anzuzeigen.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {exampleFiles.map((example, idx) => (
                        <button
                            key={example.file}
                            onClick={() => {
                                loadExampleCSV(`/data/tardoc/${example.file}`);
                                setSelectedExample(idx);
                            }}
                            className={`px-3 py-1 text-sm rounded border transition ${selectedExample === idx
                                ? 'bg-indigo-600 text-white border-indigo-700'
                                : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-100'
                                }`}
                        >
                            {example.label}
                        </button>
                    ))}
                    {selectedExample !== null && (
                        <button
                            onClick={() => {
                                setGroups([]);
                                setSelectedExample(null);
                            }}
                            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300 rounded"
                        >
                            Schliessen
                        </button>
                    )}
                </div>
            </div>








            {groups.length > 0 && (
                <>
                    <button
                        onClick={() => generateWordDoc(groups)}
                        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Export als Word
                    </button>

                    {groups.map((group, idx) => (
                        <div key={idx} className="border border-gray-300 rounded p-4 mb-6 bg-white text-sm">
                            <h3 className="font-semibold text-lg mb-2">{group.TARMED} – {group.TARMED_TEXT}</h3>

                            <table className="w-full table-auto mb-4 border text-xs">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">TP_AL_TARMED</th>
                                        <th className="border px-2 py-1">TP_TL_TARMED</th>
                                        <th className="border px-2 py-1">TP_TOTAL_TARMED</th>
                                        <th className="border px-2 py-1">Anzahl</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border px-2 py-1">{group.TP_AL_TARMED}</td>
                                        <td className="border px-2 py-1">{group.TP_TL_TARMED}</td>
                                        <td className="border px-2 py-1">{group.TP_TOTAL_TARMED}</td>
                                        <td className="border px-2 py-1">{group.NUMBER_TARMED}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {group.tardoc.length > 0 && (
                                <>
                                    <h4 className="font-semibold mb-1">TARDOC-Entsprechungen</h4>
                                    <table className="w-full table-auto border text-xs">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border px-2 py-1">TARDOC</th>
                                                <th className="border px-2 py-1">Text</th>
                                                <th className="border px-2 py-1">TP_AL</th>
                                                <th className="border px-2 py-1">TP_TL</th>
                                                <th className="border px-2 py-1">TP_TOTAL</th>
                                                <th className="border px-2 py-1">Anzahl</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.tardoc.map((t, i) => (
                                                <tr key={i}>
                                                    <td className="border px-2 py-1">{t.TARDOC}</td>
                                                    <td className="border px-2 py-1">{t.TARDOC_TEXT}</td>
                                                    <td className="border px-2 py-1">{t.TP_AL_TARDOC}</td>
                                                    <td className="border px-2 py-1">{t.TP_TL_TARDOC}</td>
                                                    <td className="border px-2 py-1">{t.TP_TOTAL_TARDOC}</td>
                                                    <td className="border px-2 py-1">{t.NUMBER_TARDOC}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}

                            <div className="mt-4 text-sm text-gray-700">
                                <p><strong>Summe TARMED TP:</strong> {group.TARMED_SUM}</p>
                                <p><strong>Summe TARDOC TP:</strong> {group.TARDOC_SUM}</p>
                                <p><strong>Delta:</strong> {group.DELTA}</p>
                            </div>
                        </div>
                    ))}

                    <div className="mt-8 p-4 border-t text-sm bg-gray-50 rounded">
                        <p><strong>Gesamtsumme TARMED TP:</strong> {totalTARMED.toFixed(2)}</p>
                        <p><strong>Gesamtsumme TARDOC TP:</strong> {totalTARDOC.toFixed(2)}</p>
                        <p><strong>Gesamtdifferenz (TARDOC - TARMED):</strong>
                            <span className={totalDELTA < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                                {' '}{totalDELTA.toFixed(2)}
                            </span>
                        </p>
                        <p>
                            <strong>Bewertung:</strong>{' '}
                            <span className={totalDELTA < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                                {totalDELTA < 0 ? 'TARDOC schlechter c.p.' : 'TARDOC besser c.p.'}
                            </span>
                        </p>
                        <p>
                            <strong>Relative Änderung:</strong>{' '}
                            <span className={totalDELTA < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                                {`${Math.abs((totalDELTA / totalTARMED) * 100).toFixed(1)}% ${totalDELTA < 0 ? 'Verlust' : 'Mehrertrag'} c.p. aufgrund von TARDOC`}
                            </span>
                        </p>
                    </div>

                </>
            )}
        </div>
    );
};

export default TardocTranscription;
