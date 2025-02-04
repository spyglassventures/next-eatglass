// pages/index.tsx
import React, { useEffect, useState } from 'react';
import LogTable from './LogTable';
import FilterButtons from './FilterButtons';
import GroupByTable from './/GroupByTable';

export interface Log {
    id: number;
    customer_name: string;
    request: string;
    response: string;
    timestamp?: string; // Adjust if your timestamp column name is different
}

export default function Home() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [offset, setOffset] = useState(0);
    const limit = 10; // Load 10 rows at a time

    // State for filtering.
    const [customerName, setCustomerName] = useState('');
    const [excludeDev, setExcludeDev] = useState(false);

    const fetchLogs = async (offsetParam = 0): Promise<Log[]> => {
        try {
            // Build the URL with query parameters based on the filter state.
            let url = `/api/pg_getLogs?limit=${limit}&offset=${offsetParam}`;
            if (customerName.trim() !== '') {
                url += `&customer_name=${encodeURIComponent(customerName.trim())}`;
            }
            if (excludeDev) {
                url += `&exclude_dev=true`;
            }
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('Error fetching logs');
            }
            const data = await res.json();
            return data.logs as Log[];
        } catch (err: any) {
            setError(err.message);
            return [];
        }
    };

    // Initial load on component mount.
    useEffect(() => {
        const initialFetch = async () => {
            const initialLogs = await fetchLogs(0);
            setLogs(initialLogs);
            setLoading(false);
        };
        initialFetch();
    }, []);

    const loadMore = async () => {
        const newOffset = offset + limit;
        const moreLogs = await fetchLogs(newOffset);
        setLogs((prev) => [...prev, ...moreLogs]);
        setOffset(newOffset);
    };

    const refreshLogs = async () => {
        setLoading(true);
        setOffset(0);
        const refreshedLogs = await fetchLogs(0);
        setLogs(refreshedLogs);
        setLoading(false);
    };

    return (
        // Full-width container with no horizontal padding or max-width restrictions.
        <div className="w-full" style={{ margin: 0, padding: 0 }}>
            <div className="flex items-center justify-between mb-4 px-4">
                <h1 className="text-2xl font-bold">Neueste KI Anfragen</h1>
                <button
                    onClick={refreshLogs}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-xs"
                >
                    Aktualisieren
                </button>
            </div>

            {/* Render filter controls (only for allowed users). */}
            <FilterButtons
                customerName={customerName}
                setCustomerName={setCustomerName}
                excludeDev={excludeDev}
                setExcludeDev={setExcludeDev}
            />

            {loading && <p className="text-xs px-4">Loading logs...</p>}
            {error && <p className="text-red-500 text-xs px-4">Error: {error}</p>}
            {!loading && logs.length === 0 && <p className="px-4 text-xs">No logs found.</p>}
            {!loading && logs.length > 0 && (
                <LogTable
                    logs={logs}
                    loadMore={loadMore}
                    refreshLogs={refreshLogs}
                    loading={loading}
                    error={error}
                />
            )}

            {/* Render the group-by table at the bottom */}
            <GroupByTable />
        </div>
    );
}
