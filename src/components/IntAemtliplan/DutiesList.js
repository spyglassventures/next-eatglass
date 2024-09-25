import React from 'react';
import DutyCard from './DutyCard';

export default function DutiesList({ duties }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {duties.length > 0 ? (
                duties.map((duty, idx) => {
                    const occurrences = duty.occurrences;
                    return occurrences.map((date, occurrenceIdx) => (
                        <DutyCard key={`${duty.duty}-${idx}-${occurrenceIdx}`} duty={duty} occurrenceDate={date} />
                    ));
                })
            ) : (
                <p className="text-gray-600">Keine Aufgaben gefunden.</p>
            )}
        </div>
    );
}
