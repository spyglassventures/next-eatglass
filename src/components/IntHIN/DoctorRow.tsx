import React from 'react';
import { ClipboardIcon, MapPinIcon, DocumentDuplicateIcon } from '@heroicons/react/24/solid';

type DoctorRowProps = {
    label: string;
    value: string;
    onCopy: () => void;
    link?: string; // Optional link for Map or external link
};

const DoctorRow: React.FC<DoctorRowProps> = ({ label, value, onCopy, link }) => {
    return (
        <div className="flex justify-between items-center text-sm text-black mb-1 pt-1">
            <span>
                <strong>{label}:</strong> {value}
            </span>
            <div className="flex space-x-2">
                <button onClick={onCopy}>
                    <DocumentDuplicateIcon className="h-4 w-4 text-gray-300 hover:text-amber-500" />
                </button>
                {link && (
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        <DocumentDuplicateIcon className="h-4 w-4 text-gray-300 hover:text-amber-500" />
                    </a>
                )}
            </div>
        </div>
    );
};

export default DoctorRow;