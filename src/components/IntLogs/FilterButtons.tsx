// components/FilterButtons.tsx
import React from 'react';

interface FilterButtonsProps {
    customerName: string;
    setCustomerName: (name: string) => void;
    excludeDev: boolean;
    setExcludeDev: (val: boolean) => void;
}

/**
 * djb2 hash function.
 */
function hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        // Force into 32-bit unsigned integer.
        hash = hash >>> 0;
    }
    return hash;
}

/**
 * The allowed hash for the string "REDACTED".
 */
const ALLOWED_HASH = 3469830391;

// Read the current user from the public environment variable.
// Make sure your .env file contains: 
const currentUser = process.env.NEXT_PUBLIC_LOG_USER || '';
const currentUserHash = hashString(currentUser);

console.log('[FilterButtons] currentUser:', currentUser);
console.log('[FilterButtons] currentUserHash:', currentUserHash);

const FilterButtons: React.FC<FilterButtonsProps> = ({
    customerName,
    setCustomerName,
    excludeDev,
    setExcludeDev,
}) => {
    console.log('[FilterButtons] Rendering filter buttons, currentUserHash:', currentUserHash);

    // Only show the filter section if the computed hash matches ALLOWED_HASH.
    if (currentUserHash !== ALLOWED_HASH) {
        console.log('[FilterButtons] Hiding filter buttons because currentUserHash does not match allowed hash');
        return null;
    }

    console.log('[FilterButtons] Showing filter buttons');

    return (
        <div className="px-4 mb-4">
            <input
                type="text"
                placeholder="Filter by Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border p-2 mr-2"
            />
            <button
                onClick={() => setCustomerName('naefels')}
                className="bg-blue-500 text-white py-2 px-4 rounded text-xs mr-2"
            >
                naefels
            </button>
            <button
                onClick={() => setCustomerName('kappelihof')}
                className="bg-blue-500 text-white py-2 px-4 rounded text-xs mr-2"
            >
                kappelihof
            </button>
            <button
                onClick={() => setCustomerName('praxisimcity')}
                className="bg-blue-500 text-white py-2 px-4 rounded text-xs mr-2"
            >
                praxisimcity
            </button>
            <button
                onClick={() => setCustomerName('bettmeralp')}
                className="bg-blue-500 text-white py-2 px-4 rounded text-xs mr-2"
            >
                bettmeralp
            </button>
            <button
                onClick={() => setCustomerName('kirchbuehl')}
                className="bg-blue-500 text-white py-2 px-4 rounded text-xs mr-2"
            >
                kirchbuehl
            </button>
            <button
                onClick={() => setCustomerName('marbach')}
                className="bg-blue-500 text-white py-2 px-4 rounded text-xs mr-2"
            >
                marbach
            </button>
            <button
                onClick={() => setCustomerName('praxisoerlikon')}
                className="bg-blue-500 text-white py-2 px-4 rounded text-xs mr-2"
            >
                praxisoerlikon
            </button>
            <button
                onClick={() => setCustomerName('frauenfeld')}
                className="bg-blue-500 text-white py-2 px-4 rounded text-xs mr-2"
            >
                frauenfeld
            </button>
            <button
                onClick={() => setExcludeDev(!excludeDev)}
                className={`py-2 px-4 rounded text-xs ${excludeDev ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'
                    }`}
            >
                {excludeDev ? 'Excluding *_dev' : 'Include *_dev'}
            </button>
        </div>
    );
};

export default FilterButtons;
