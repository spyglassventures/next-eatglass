// next-kappelihof/src/components/InternalDocuments/index.tsx
import React, { useState } from 'react';
import { DocumentIcon } from '@heroicons/react/24/solid';
import documents from '../../config/InternalDocuments/filesConfig'; // Ensure to import the document configuration

interface Document {
    name: string;
    filename: string;
    path: string;
    previewable: boolean;
}

// Utility function to truncate the title
function truncateTitle(title: string, maxLength: number) {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
}

export default function InternalDocuments() {
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<keyof Document>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const filteredDocuments = documents
        .filter((doc) =>
            doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

    const handleSortChange = (key: keyof Document) => {
        if (key === sortKey) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            {selectedDocument ? (
                <div className="document-viewer">
                    <button onClick={() => setSelectedDocument(null)} className="text-lg mb-4 text-amber-500 hover:underline">
                        ← Zurück zur Übersicht
                    </button>
                    <h3 className="text-2xl font-semibold mb-4">{selectedDocument.name}</h3>
                    <div className="mb-4">
                        {selectedDocument.previewable ? (
                            <iframe
                                src={selectedDocument.path}
                                className="w-full h-96 border rounded-lg"
                                title={selectedDocument.name}
                            />
                        ) : (
                            <p>Vorschau nicht verfügbar.</p>
                        )}
                    </div>
                    <a
                        href={selectedDocument.path}
                        download={selectedDocument.filename}
                        className="inline-flex items-center px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 mr-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                        </svg>
                        Download
                    </a>
                </div>
            ) : (
                <div>
                    <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Suche nach Dokument..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4 md:mb-0"
                        />
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleSortChange('name')}
                                className={`px-4 py-2 rounded-lg font-medium ${sortKey === 'name' ? 'bg-amber-500 text-white' : 'bg-gray-400 text-white hover:bg-amber-500'}`}
                            >
                                Name {sortKey === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </button>
                            <button
                                onClick={() => handleSortChange('filename')}
                                className={`px-4 py-2 rounded-lg font-medium ${sortKey === 'filename' ? 'bg-amber-500 text-white' : 'bg-gray-400 text-white hover:bg-amber-500'}`}
                            >
                                Dateiname {sortKey === 'filename' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </button>
                            <button
                                onClick={() => handleSortChange('previewable')}
                                className={`px-4 py-2 rounded-lg font-medium ${sortKey === 'previewable' ? 'bg-amber-500 text-white' : 'bg-gray-400 text-white hover:bg-amber-500'}`}
                            >
                                Vorschau verfügbar {sortKey === 'previewable' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </button>
                        </div>
                    </div>

                    {/* Document Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDocuments.length > 0 ? (
                            filteredDocuments.map((doc) => (
                                <div
                                    key={`${doc.name}-${doc.filename}`}
                                    className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer"
                                    onClick={() => setSelectedDocument(doc)}
                                >
                                    <DocumentIcon className="h-6 w-6 text-amber-500 mb-2" aria-hidden="true" />
                                    <div>
                                        <h3 className="font-semibold mb-2">{truncateTitle(doc.name, 30)}</h3>
                                        {doc.previewable ? (
                                            <div className="border border-gray-300 rounded-lg overflow-hidden mb-2">
                                                <iframe
                                                    src={doc.path}
                                                    className="w-full h-40"
                                                    title={`Preview of ${doc.name}`}
                                                />
                                            </div>
                                        ) : (
                                            <div className="border border-gray-300 rounded-lg p-4 mb-2 text-center text-gray-500">
                                                Keine Vorschau
                                            </div>
                                        )}
                                        <p className="text-sm text-gray-600">{doc.previewable ? 'Klicken für Vorschau' : 'Download'}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600">Keine Dokumente gefunden.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
