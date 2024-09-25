import React from 'react';

interface DocumentListProps {
    documents: any[];
    handleSortChange: (key: keyof any) => void;
    setSelectedDocument: (doc: any) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, setSelectedDocument }) => {
    const truncateTitle = (title: string, maxLength: number) => {
        return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.length > 0 ? (
                documents.map((doc) => (
                    <div
                        key={`${doc.name}-${doc.filename}`}
                        className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition cursor-pointer"
                        onClick={() => setSelectedDocument(doc)} // Make the entire card clickable
                    >
                        <div>
                            {/* Limit the title to 30 characters */}
                            <h3 className="font-semibold mb-2">
                                {truncateTitle(doc.name, 25)}
                            </h3>

                            {/* Preview Container with consistent height */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden mb-2 h-40 flex items-center justify-center">
                                {doc.previewable ? (
                                    <iframe
                                        src={doc.path + doc.filename}
                                        className="w-full h-full pointer-events-none"
                                        title={`Preview of ${doc.name}`}
                                    />
                                ) : (
                                    <div className="text-center text-gray-500">
                                        Keine Vorschau verfügbar
                                    </div>
                                )}
                            </div>

                            {/* Display numPages if available */}
                            {doc.numPages && (
                                <p className="text-sm text-gray-500">
                                    {doc.numPages} Seite{doc.numPages > 1 ? 'n' : ''}.
                                </p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-600">Keine Dokumente gefunden.</p>
            )}
        </div>
    );
};

export default DocumentList;
