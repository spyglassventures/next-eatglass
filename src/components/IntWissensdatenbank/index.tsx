import React, { useEffect, useState } from 'react';
import { DocumentIcon } from '@heroicons/react/24/solid';

interface Document {
    name: string;
    filename: string;
    path: string;
    previewable: boolean;
}

export default function InternalDocuments() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<keyof Document>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        // Fetch the documents from the API
        fetch('/api/documents/list_documents_wissensdatenbank_dyn')
            .then((res) => res.json())
            .then((data) => setDocuments(data))
            .catch((err) => console.error('Error fetching documents:', err));
    }, []);

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
                    <iframe
                        src={selectedDocument.path} // Encoded URL provided by the API
                        className="w-full h-96 border rounded-lg"
                        title={selectedDocument.name}
                    />
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
                            <button onClick={() => handleSortChange('name')} className="px-4 py-2 rounded-lg font-medium bg-gray-400 hover:bg-amber-500">
                                Name {sortKey === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDocuments.length > 0 ? (
                            filteredDocuments.map((doc) => (
                                <div
                                    key={doc.filename}
                                    className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer"
                                    onClick={() => setSelectedDocument(doc)}
                                >
                                    <DocumentIcon className="h-6 w-6 text-amber-500 mb-2" />
                                    <h3 className="font-semibold mb-2">{doc.name}</h3>
                                    <p className="text-sm text-gray-600">{doc.previewable ? 'Klicken für Vorschau' : 'Download'}</p>
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
