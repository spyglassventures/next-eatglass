import React from 'react';

interface DocumentViewerProps {
    selectedDocument: any;
    setSelectedDocument: (doc: null) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ selectedDocument, setSelectedDocument }) => {
    return (
        <div className="document-viewer">
            <button onClick={() => setSelectedDocument(null)} className="text-lg mb-4 text-amber-500 hover:underline">
                ← Zurück zur Dokumentenliste
            </button>
            <h3 className="text-2xl font-semibold mb-4">{selectedDocument.name}</h3>
            <div className="mb-4">
                {selectedDocument.previewable ? (
                    <iframe
                        src={selectedDocument.path + selectedDocument.filename}
                        className="w-full h-96 border rounded-lg"
                        title={selectedDocument.name}
                    />
                ) : (
                    <p>Vorschau nicht verfügbar.</p>
                )}
            </div>
            {/* If you have number of pages in your JSON, you can display it like this */}
            {selectedDocument.numPages && (
                <p className="text-sm text-gray-500">
                    Das Dokument enthält {selectedDocument.numPages} Seite{selectedDocument.numPages > 1 ? 'n' : ''}.
                </p>
            )}
            <a
                href={selectedDocument.path + selectedDocument.filename}
                download={selectedDocument.filename}
                className="inline-flex items-center px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition"
            >
                Download {selectedDocument.name}
            </a>
        </div>
    );
};

export default DocumentViewer;
