// components/GroupByTable.tsx
import React, { useEffect, useState } from 'react';

interface GroupRow {
    customer_name: string;
    count: string; // PostgreSQL returns count as a string
}

/**
 * djb2 hash function.
 */
function hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        // Force into a 32-bit unsigned integer.
        hash = hash >>> 0;
    }
    return hash;
}

/**
 * Allowed hash for "REDACTED" (computed offline).
 */
const ALLOWED_HASH = 3469830391;

// Read the current user from the public environment variable.
// (Make sure your .env file contains NEXT_PUBLIC_LOG_USER=REDACTED)
let currentUser = process.env.NEXT_PUBLIC_LOG_USER || '';
// Normalize: trim and remove any surrounding quotes.
currentUser = currentUser.trim().replace(/^['"]|['"]$/g, '');
const currentUserHash = hashString(currentUser);

console.log('[GroupByTable] currentUser:', currentUser);
console.log('[GroupByTable] currentUserHash:', currentUserHash);

const GroupByTable: React.FC = () => {
    // Always call hooks unconditionally.
    const [data, setData] = useState<GroupRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        // Only fetch data if the user is allowed.
        if (currentUserHash === ALLOWED_HASH) {
            const fetchGroupData = async () => {
                try {
                    const res = await fetch('/api/pg_groupby');
                    if (!res.ok) {
                        throw new Error('Error fetching group data');
                    }
                    const result = await res.json();
                    // Adjust the property name if needed (e.g. result.logs or result.rows)
                    setData(result.logs);
                    setLoading(false);
                } catch (err: any) {
                    setError(err.message);
                    setLoading(false);
                }
            };
            fetchGroupData();
        } else {
            // If the user is not allowed, simply mark as not loading.
            setLoading(false);
        }
    }, []);

    // Now conditionally render the component.
    if (currentUserHash !== ALLOWED_HASH) {
        console.log('[GroupByTable] Hiding group-by table: unauthorized user');
        return null;
    }

    if (loading) return <p className="px-4 text-xs">Loading group data...</p>;
    if (error) return <p className="text-red-500 px-4 text-xs">Error: {error}</p>;
    if (!data || data.length === 0)
        return <p className="px-4 text-xs">No group data found.</p>;

    // Calculate the total count (convert string counts to numbers).
    const total = data.reduce((sum, row) => sum + parseInt(row.count), 0);

    return (
        <div className="px-4 mt-8">
            <h2 className="text-lg font-bold mb-4">Logs Grouped by Customer Name</h2>
            <table className="table-auto w-full border-collapse text-left text-xs">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Customer Name</th>
                        <th className="border px-2 py-1">Count</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td className="border px-2 py-1">{row.customer_name}</td>
                            <td className="border px-2 py-1">{row.count}</td>
                        </tr>
                    ))}
                    <tr className="font-bold">
                        <td className="border px-2 py-1">Total</td>
                        <td className="border px-2 py-1">{total}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default GroupByTable;
