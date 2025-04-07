'use client';

import React, { useState } from 'react';

export interface MaterialItem {
    Sql_PositionNr: string;
    Sql_Leistung: string;
    Sql_Anzahl: string;
    Sql_Einkauf: string;
    Sql_Betrag: string;
    Sql_Titel: string;
}

interface Props {
    data: MaterialItem[];
    filter: string;
    tags: string[]; // 💥 Wichtig: das fehlte vorher
}

const MaterialTabelle: React.FC<Props> = ({ data, filter, tags }) => {
    const [sortKey, setSortKey] = useState<string>('Sql_PositionNr');
    const [sortAsc, setSortAsc] = useState<boolean>(true);

    const parseNumber = (value: unknown): number => {
        if (typeof value === 'string') {
            return parseFloat(value.replace(',', '.')) || 0;
        }
        if (typeof value === 'number') {
            return value;
        }
        return 0;
    };

    const calculateMetrics = (item: MaterialItem) => {
        const einkauf = parseNumber(item.Sql_Einkauf);
        const verkauf = parseNumber(item.Sql_Betrag);
        const anzahl = parseNumber(item.Sql_Anzahl);

        const margeCHF = verkauf - einkauf;
        const margeProzent = einkauf > 0 ? (margeCHF / einkauf) * 100 : 0;
        const margeProPackung = anzahl > 0 ? margeCHF / anzahl : 0;

        let kommentar = '';
        let highlight = '';

        if (anzahl < 1) {
            kommentar = 'Anzahl < 1: Datenfehler';
            highlight = 'text-red-600 font-semibold';
        } else if (margeProzent > 400) {
            kommentar = 'Marge unrealistisch hoch';
            highlight = 'text-red-600 font-semibold';
        } else if (margeProzent > 60) {
            kommentar = 'OK';
            highlight = 'text-yellow-600 font-medium';
        } else if (margeProzent <= 5 && margeProzent >= 0) {
            kommentar = 'zu prüfen';
            highlight = 'text-yellow-600 font-medium';
        } else if (margeProzent < 0) {
            kommentar = 'negative Marge: Datenfehler';
            highlight = 'text-red-600 font-semibold';
        }

        return {
            margeCHF,
            margeProzent,
            margeProPackung,
            kommentar,
            highlight,
        };
    };

    const filteredData = data.filter(item => {
        const combined = (item.Sql_Titel + ' ' + item.Sql_Leistung).toLowerCase();
        const tagMatch = tags.length === 0 || tags.some(tag => combined.includes(tag.toLowerCase()));
        const textMatch = filter === '' || combined.includes(filter.toLowerCase());
        return tagMatch && textMatch;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        const valA = a[sortKey as keyof MaterialItem] || '';
        const valB = b[sortKey as keyof MaterialItem] || '';

        const numA = parseNumber(valA);
        const numB = parseNumber(valB);

        if (!isNaN(numA) && !isNaN(numB)) {
            return sortAsc ? numA - numB : numB - numA;
        }

        return sortAsc
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
    });

    const headers: { key: string; label: string }[] = [
        { key: 'Sql_PositionNr', label: 'PosNr Vitomed' },
        { key: 'Sql_Leistung', label: 'Leistung' },
        { key: 'Sql_Anzahl', label: 'Anzahl' },
        { key: 'Sql_Einkauf', label: 'Einkauf (CHF)' },
        { key: 'Sql_Betrag', label: 'Verkauf (CHF)' },
        { key: 'Sql_Titel', label: 'Kategorie' },
        { key: 'margeProzent', label: 'Marge %' },
        { key: 'margeCHF', label: 'Marge CHF' },
        { key: 'margeProPackung', label: 'Marge/Packung' },
        { key: 'kommentar', label: 'Kommentar' },
    ];

    const handleSort = (key: string) => {
        if (key === sortKey) setSortAsc(!sortAsc);
        else {
            setSortKey(key);
            setSortAsc(true);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm bg-white dark:bg-gray-800 rounded shadow">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        {headers.map(h => (
                            <th
                                key={h.key}
                                onClick={() => handleSort(h.key)}
                                className="px-2 py-1 border cursor-pointer hover:underline"
                            >
                                {h.label} {sortKey === h.key ? (sortAsc ? '▲' : '▼') : ''}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((item, idx) => {
                        const {
                            margeCHF,
                            margeProzent,
                            margeProPackung,
                            kommentar,
                            highlight,
                        } = calculateMetrics(item);

                        return (
                            <tr key={idx} className="hover:bg-indigo-50 dark:hover:bg-gray-700">
                                <td className="px-2 py-1 border">{item.Sql_PositionNr}</td>
                                <td className="px-2 py-1 border text-left">{item.Sql_Leistung}</td>
                                <td className="px-2 py-1 border">{item.Sql_Anzahl}</td>
                                <td className="px-2 py-1 border">{item.Sql_Einkauf}</td>
                                <td className="px-2 py-1 border">{item.Sql_Betrag}</td>
                                <td className="px-2 py-1 border">{item.Sql_Titel}</td>
                                <td className={`px-2 py-1 border ${highlight}`}>{margeProzent.toFixed(1)}%</td>
                                <td className="px-2 py-1 border">{margeCHF.toFixed(2)}</td>
                                <td className="px-2 py-1 border">{margeProPackung.toFixed(2)}</td>
                                <td className={`px-2 py-1 border ${highlight}`}>{kommentar}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MaterialTabelle;
