// components/SimpleModal.tsx
import React from 'react';

interface SimpleModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative z-50">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
                </div>
                <div className="text-sm text-gray-700">{children}</div>
                <div className="mt-4 text-right">
                    <button onClick={onClose} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                        Schliessen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimpleModal;
