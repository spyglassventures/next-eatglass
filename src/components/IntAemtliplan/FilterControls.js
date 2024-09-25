import React from 'react';
import { categories, persons } from '../../config/InternalDocuments/Aemtlis';
import PeriodNavigation from './PeriodNavigation';

export default function FilterControls({ searchTerm, setSearchTerm, filterCategory, setFilterCategory, filterPerson, setFilterPerson, filterFrequency, setFilterFrequency, startDate, setStartDate, endDate, setEndDate, selectedPeriod, setSelectedPeriod }) {
    return (
        <div className="flex flex-col md:flex-row justify-between mb-4">
            {/* Left side: Dropdowns */}
            <div className="flex flex-col space-y-2">
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                    <option value="">Kategorie</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select
                    value={filterPerson}
                    onChange={(e) => setFilterPerson(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                    <option value="">Person</option>
                    {persons.map(person => (
                        <option key={person} value={person}>{person}</option>
                    ))}
                </select>
                <select
                    value={filterFrequency}
                    onChange={(e) => setFilterFrequency(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                    <option value="">Aufgabentyp</option>
                    <option value="week">Wöchentlich</option>
                    <option value="month">Monatlich</option>
                    <option value="quarter">Quartalsweise</option>
                    <option value="half-year">Halbjährlich</option>
                </select>
            </div>

            {/* Center: Search bar */}
            <div className="flex flex-col space-y-2">
                <input
                    type="text"
                    placeholder="Suche nach Aufgaben..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <PeriodNavigation
                    selectedPeriod={selectedPeriod}
                    setSelectedPeriod={setSelectedPeriod}
                />
            </div>

            {/* Right side: Date Pickers */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <label>
                    <span className="block text-sm font-medium text-gray-700">Datum von:</span>
                    <input
                        type="date"
                        value={startDate.toISOString().substr(0, 10)}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </label>
                <label>
                    <span className="block text-sm font-medium text-gray-700">Datum bis:</span>
                    <input
                        type="date"
                        value={endDate.toISOString().substr(0, 10)}
                        onChange={(e) => setEndDate(new Date(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </label>
            </div>
        </div>
    );
}
