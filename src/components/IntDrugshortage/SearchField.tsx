// components/SearchField.tsx

import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

interface SearchFieldProps {
    searchTerm: string;
    onChange: (value: string) => void;
}

export const SearchField: React.FC<SearchFieldProps> = ({ searchTerm, onChange }) => (
    <div className="relative w-full mb-6">
        <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <MagnifyingGlassIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
    </div>
);
