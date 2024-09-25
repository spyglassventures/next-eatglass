import React from 'react';

// Function to determine the button styling
const getButtonClass = (isActive: boolean) =>
    isActive ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-800 hover:bg-amber-500';

interface FilterButtonsProps {
    filterLetter: string | null;
    filterCompany: string | null;
    onLetterFilter: (letter: string | null) => void;
    onCompanyFilter: (company: string | null) => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
    filterLetter, filterCompany, onLetterFilter, onCompanyFilter
}) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const companies = ['Sandoz', 'Mepha', 'Streuli', 'Helvepharm'];

    return (
        <div className="mb-6 flex justify-between items-center">
            {/* Letter Filters on the Left */}
            <div className="flex flex-wrap space-x-1">
                {letters.map((letter) => (
                    <button
                        key={letter}
                        onClick={() => onLetterFilter(letter)}
                        className={`px-2 py-2 rounded transition-colors duration-200 ease-in-out ${getButtonClass(filterLetter === letter)}`}
                    >
                        {letter}
                    </button>
                ))}
                <button
                    onClick={() => onLetterFilter(null)}
                    className={`px-4 py-2 rounded transition-colors duration-200 ease-in-out ${getButtonClass(filterLetter === null)}`}
                >
                    Alle
                </button>
            </div>

            {/* Company Filters on the Right */}
            <div className="flex space-x-2 justify-end">
                {companies.map((company) => (
                    <button
                        key={company}
                        onClick={() => onCompanyFilter(company)}
                        className={`px-3 py-2 rounded transition-colors duration-200 ease-in-out ${getButtonClass(filterCompany === company)}`}
                    >
                        {company}
                    </button>
                ))}
                <button
                    onClick={() => onCompanyFilter(null)}
                    className={`px-4 py-2 rounded transition-colors duration-200 ease-in-out ${getButtonClass(filterCompany === null)}`}
                >
                    Alle
                </button>
            </div>
        </div>
    );
};
