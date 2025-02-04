// src/components/IntLogs/LogTable.tsx
import React, { useState } from 'react';
import { Log } from './index';

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

console.log('[LogTable] currentUser:', currentUser);
console.log('[LogTable] currentUserHash:', currentUserHash);

interface LogTableProps {
    logs: Log[];
    loadMore: () => void;
    refreshLogs: () => void;
    loading: boolean;
    error: string;
}

/**
 * ExpandableJsonCell and ExpandableCell components remain unchanged.
 */
const ExpandableJsonCell: React.FC<{ jsonText: string; defaultExpanded?: boolean }> = ({
    jsonText,
    defaultExpanded = false,
}) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    let parsed: any;
    try {
        parsed = JSON.parse(jsonText);
    } catch (e) {
        return <div style={{ whiteSpace: 'pre-wrap' }}>{jsonText}</div>;
    }
    const messages = parsed.messages;
    if (!messages || !Array.isArray(messages)) {
        return <div style={{ whiteSpace: 'pre-wrap' }}>{jsonText}</div>;
    }

    const displayMessages = expanded ? messages : messages.slice(0, 2);

    return (
        <div className="text-xs">
            {displayMessages.map((msg: any, index: number) => (
                <div key={index}>
                    <strong>{msg.role}:</strong>{' '}
                    {msg.role === 'user' ? (
                        <span style={{ backgroundColor: 'yellow', padding: '0 2px' }}>
                            {msg.content}
                        </span>
                    ) : (
                        msg.content
                    )}
                </div>
            ))}
            {messages.length > displayMessages.length && !defaultExpanded && !expanded && (
                <button onClick={() => setExpanded(true)} className="text-blue-500 underline">
                    Read More
                </button>
            )}
            {(!defaultExpanded && expanded) && messages.length > 2 && (
                <button onClick={() => setExpanded(false)} className="text-blue-500 underline ml-2">
                    Show Less
                </button>
            )}
        </div>
    );
};

const ExpandableCell: React.FC<{ text: string; limit?: number; alwaysExpanded?: boolean }> = ({
    text,
    limit = 50,
    alwaysExpanded = false,
}) => {
    try {
        const parsed = JSON.parse(text);
        if (parsed.messages && Array.isArray(parsed.messages)) {
            return <ExpandableJsonCell jsonText={text} defaultExpanded={alwaysExpanded} />;
        }
    } catch (e) {
        // Continue with normal behavior if JSON parsing fails.
    }

    if (alwaysExpanded) {
        return (
            <div className="text-xs">
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{text}</pre>
            </div>
        );
    }

    const [expanded, setExpanded] = useState(false);
    const toggle = () => setExpanded(!expanded);
    const safeText = text || '';
    const displayText = !expanded && safeText.length > limit ? safeText.substring(0, limit) : safeText;

    return (
        <div className="text-xs">
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{displayText}</pre>
            {!expanded && safeText.length > limit && '...'}
            {safeText.length > limit && (
                <button onClick={toggle} className="text-blue-500 underline ml-1">
                    {expanded ? 'Show Less' : 'Read More'}
                </button>
            )}
        </div>
    );
};

const LogTable: React.FC<LogTableProps> = ({ logs, loadMore, refreshLogs, loading, error }) => {
    // Always call hooks unconditionally.
    const [selectedLog, setSelectedLog] = useState<Log | null>(null);

    // Compute the authorization flag.
    const isAuthorized = currentUserHash === ALLOWED_HASH;

    // Now, conditionally render the content.
    if (!isAuthorized) {
        console.log('[LogTable] Hiding log table: unauthorized user');
        return null;
    }

    const closeModal = () => {
        setSelectedLog(null);
    };

    return (
        <>
            <div className="px-4">
                <div className="overflow-x-auto">
                    <table
                        className="table-auto divide-y divide-gray-200 border text-xs"
                        style={{ minWidth: '1600px' }}
                    >
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 border">ID</th>
                                <th className="px-4 py-2 border">Customer Name</th>
                                <th className="px-4 py-2 border">Request</th>
                                <th className="px-4 py-2 border">Response</th>
                                <th className="px-4 py-2 border">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {logs.map((log) => (
                                <tr key={log.id}>
                                    <td className="px-4 py-2 border flex items-center space-x-1">
                                        <span>{log.id}</span>
                                        <button
                                            onClick={() => setSelectedLog(log)}
                                            title="View Details"
                                            className="focus:outline-none"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-blue-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 border">{log.customer_name}</td>
                                    <td className="px-4 py-2 border whitespace-pre-wrap">
                                        <ExpandableCell text={log.request} limit={50} />
                                    </td>
                                    <td className="px-4 py-2 border whitespace-pre-wrap">
                                        <ExpandableCell text={log.response} limit={50} />
                                    </td>
                                    <td className="px-4 py-2 border">
                                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4">
                    <button
                        onClick={loadMore}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-xs"
                    >
                        Mehr Einträge laden
                    </button>
                </div>
            </div>

            {selectedLog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={closeModal}
                >
                    <div
                        className="bg-white rounded shadow-lg flex flex-col"
                        style={{ width: '85vw', height: '85vh' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold">Log Details (ID: {selectedLog.id})</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                                title="Close"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-4 flex-1 overflow-auto">
                            <div className="mb-4">
                                <strong>Customer Name:</strong> {selectedLog.customer_name}
                            </div>
                            <div className="mb-4">
                                <strong>Timestamp:</strong>{' '}
                                {selectedLog.timestamp ? new Date(selectedLog.timestamp).toLocaleString() : 'N/A'}
                            </div>
                            <div className="mb-4">
                                <strong>Request:</strong>
                                <div className="bg-gray-100 p-2 mt-1 overflow-auto" style={{ maxHeight: '40vh' }}>
                                    <ExpandableCell text={selectedLog.request} alwaysExpanded={true} />
                                </div>
                            </div>
                            <div>
                                <strong>Response:</strong>
                                <div className="bg-gray-100 p-2 mt-1 overflow-auto" style={{ maxHeight: '40vh' }}>
                                    <ExpandableCell text={selectedLog.response} alwaysExpanded={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LogTable;
