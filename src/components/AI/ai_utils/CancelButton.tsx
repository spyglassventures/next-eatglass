'use client';

interface CancelButtonProps {
    isLoading: boolean;
    onCancel: () => void;
}

export default function CancelButton({ isLoading, onCancel }: CancelButtonProps) {
    return (
        <button
            onClick={onCancel}
            disabled={!isLoading}
            className="relative -top-8  p-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
            Abbrechen der Anfrage
        </button>
    );
}
