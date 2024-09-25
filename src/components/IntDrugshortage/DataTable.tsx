import React from 'react';
import { HighlightText } from './HighlightText';

interface DataTableProps {
    data: any[];
    searchTerm: string;
    filteredData: (data: any[]) => any[];
}

export const DataTable: React.FC<DataTableProps> = ({ data, searchTerm, filteredData }) => (
    <div>
        {data.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
                <thead className="bg-gray-200 dark:bg-gray-700">
                    <tr>
                        {Object.keys(data[0]).map((key, index) => (
                            <th key={index} className="border px-4 py-2 text-left dark:text-gray-300">{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData(data).map((row, rowIndex) => (
                        <tr key={rowIndex} className="even:bg-gray-100 dark:even:bg-gray-800">
                            {Object.values(row).map((cell, cellIndex) => (
                                <td key={cellIndex} className="border px-4 py-2 dark:text-gray-300">
                                    <HighlightText text={String(cell)} query={searchTerm} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
        )}
    </div>
);
