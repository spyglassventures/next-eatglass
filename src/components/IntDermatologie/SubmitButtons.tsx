import React from 'react';

type Props = {
    isSending: boolean;
    onSubmit: () => void;
    onDownload: () => void;
};

export const SubmitButtons: React.FC<Props> = ({
    isSending, onSubmit, onDownload
}) => (
    <div className="text-center space-x-4">
        <button
            type="button"
            onClick={onSubmit}
            disabled={isSending}
            className="bg-gray-800 text-white px-6 py-3 rounded"
        >
            {isSending ? 'Wird gesendet…' : 'Anfrage absenden'}
        </button>
        <button
            type="button"
            onClick={onDownload}
            className="bg-blue-600 text-white px-6 py-3 rounded"
        >
            Als JSON speichern
        </button>
    </div>
);
