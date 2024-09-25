import React, { useState, useEffect } from 'react';
import DutiesList from './DutiesList';
import FilterControls from './FilterControls';
import PeriodNavigation from './PeriodNavigation';
import duties from '../../config/InternalDocuments/Aemtlis';
import { getOccurrencesWithinRange } from './dateUtils';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from 'date-fns';

export default function OfficeDuties() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterPerson, setFilterPerson] = useState('');
    const [filterFrequency, setFilterFrequency] = useState('');
    const [startDate, setStartDate] = useState(addDays(new Date(), 0));
    const [endDate, setEndDate] = useState(addDays(new Date(), 30));
    const [selectedPeriod, setSelectedPeriod] = useState('custom');

    useEffect(() => {
        switch (selectedPeriod) {
            case 'week':
                setStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
                setEndDate(endOfWeek(new Date(), { weekStartsOn: 1 }));
                break;
            case 'month':
                setStartDate(startOfMonth(new Date()));
                setEndDate(endOfMonth(new Date()));
                break;
            case 'quarter':
                setStartDate(startOfQuarter(new Date()));
                setEndDate(endOfQuarter(new Date()));
                break;
            default:
                break;
        }
    }, [selectedPeriod]);

    const filteredDuties = duties.map(duty => {
        const occurrences = getOccurrencesWithinRange(duty, startDate, endDate);
        return { ...duty, occurrences };
    }).filter(duty =>
        duty.category.toLowerCase().includes(filterCategory.toLowerCase()) &&
        duty.person.toLowerCase().includes(filterPerson.toLowerCase()) &&
        duty.frequency.toLowerCase().includes(filterFrequency.toLowerCase()) &&
        duty.duty.toLowerCase().includes(searchTerm.toLowerCase()) &&
        duty.occurrences.length > 0
    );

    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            <FilterControls
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterPerson={filterPerson}
                setFilterPerson={setFilterPerson}
                filterFrequency={filterFrequency}
                setFilterFrequency={setFilterFrequency}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
            />
            {filterPerson && (
                <h2 className="text-xl font-semibold mb-4">
                    Aufgaben für: {filterPerson}
                </h2>
            )}
            <DutiesList duties={filteredDuties} />
        </div>
    );
}
