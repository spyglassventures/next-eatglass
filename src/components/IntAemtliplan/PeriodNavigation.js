import React from 'react';

export default function PeriodNavigation({ selectedPeriod, setSelectedPeriod }) {
    const navItemClasses = (isActive) => `px-4 py-2 border ${isActive ? 'bg-gray-500 text-white' : 'bg-white text-gray-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 hover:bg-amber-500 hover:text-white transition-colors`;

    return (
        <div className="flex space-x-2">
            <button
                className={navItemClasses(selectedPeriod === 'week')}
                onClick={() => setSelectedPeriod('week')}
            >
                diese Woche
            </button>
            <button
                className={navItemClasses(selectedPeriod === 'month')}
                onClick={() => setSelectedPeriod('month')}
            >
                diesen Monat
            </button>
            <button
                className={navItemClasses(selectedPeriod === 'quarter')}
                onClick={() => setSelectedPeriod('quarter')}
            >
                dieses Quartal
            </button>
            <button
                className={navItemClasses(selectedPeriod === 'custom')}
                onClick={() => setSelectedPeriod('custom')}
            >
                Benutzerdefiniert
            </button>
        </div>
    );
}
