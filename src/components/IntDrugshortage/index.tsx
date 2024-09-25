// pages/DrugShortage.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { dataSources } from '../../config/InternalDocuments/DrugShortageData';

import { Tabs } from './Tabs';
import { SearchField } from './SearchField';
import { FilterButtons } from './FilterButtons';
import { DataTable } from './DataTable';

export default function DrugShortage() {
    const [activeTab, setActiveTab] = useState('Lieferengpass');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLetter, setFilterLetter] = useState<string | null>(null);
    const [filterCompany, setFilterCompany] = useState<string | null>(null);
    const [lieferengpassData, setLieferengpassData] = useState<any[]>([]);
    const [mutationenData, setMutationenData] = useState<any[]>([]);

    useEffect(() => {
        fetch(dataSources.lieferengpass)
            .then(response => response.text())
            .then(csvText => {
                Papa.parse(csvText, {
                    complete: (result) => {
                        setLieferengpassData(result.data.slice(1)); // Skip the header
                    },
                    header: true // Parse with headers
                });
            });

        fetch(dataSources.mutationen)
            .then(response => response.text())
            .then(csvText => {
                Papa.parse(csvText, {
                    complete: (result) => {
                        setMutationenData(result.data.slice(1)); // Skip the header
                    },
                    header: true // Parse with headers
                });
            });
    }, []);

    const handleLetterFilter = (letter: string | null) => {
        setFilterLetter(letter);
    };

    const handleCompanyFilter = (company: string | null) => {
        setFilterCompany(company);
    };

    const filteredData = (data: any[]) => {
        return data.filter(row => {
            const matchesSearch = Object.values(row).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesLetter = filterLetter
                ? row.Bezeichnung && row.Bezeichnung.startsWith(filterLetter)
                : true;
            const matchesCompany = filterCompany
                ? row.Firma && row.Firma.toLowerCase().startsWith(filterCompany.toLowerCase())
                : true;

            return matchesSearch && matchesLetter && matchesCompany;
        });
    };

    return (
        <div className="">
            <h1 className="text-3xl font-bold mb-4">Drug Shortage Information (Demo, Daten vom 30.8.2024)</h1>

            {/* Flex container for Tabs and SearchField */}
            <div className="flex justify-between items-center mb-6">
                <Tabs activeTab={activeTab} onChangeTab={setActiveTab} />
                <div className="w-1/3">
                    <SearchField searchTerm={searchTerm} onChange={setSearchTerm} />
                </div>
            </div>

            <FilterButtons
                filterLetter={filterLetter}
                filterCompany={filterCompany}
                onLetterFilter={handleLetterFilter}
                onCompanyFilter={handleCompanyFilter}
            />

            {activeTab === 'Lieferengpass' && (
                <DataTable data={lieferengpassData} searchTerm={searchTerm} filteredData={filteredData} />
            )}

            {activeTab === 'Mutationen' && (
                <DataTable data={mutationenData} searchTerm={searchTerm} filteredData={filteredData} />
            )}
        </div>
    );
}
