import React from 'react';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, DocumentDuplicateIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { DetailedDoctor } from './types';

type DoctorDetailsProps = {
    doctor: DetailedDoctor;
};

const DoctorDetails: React.FC<DoctorDetailsProps> = ({ doctor }) => {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    // Function to open Google search in a new tab with name and address
    const handleGoogleSearch = () => {
        const query = `${doctor?.firstName || ''} ${doctor?.lastName || ''} ${doctor?.address || ''}, ${doctor?.postalCode || ''} ${doctor?.city || ''}`;
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(googleSearchUrl, '_blank');
    };

    return (
        <div className="space-y-2">
            {/* Name and Academic Title */}
            {doctor?.firstName && doctor?.lastName && (
                <p className="flex justify-between items-center">
                    <strong>{doctor?.academicTitle || ''} {doctor?.firstName} {doctor?.lastName}</strong>
                    <div className="flex space-x-2">
                        <button onClick={() => handleCopy(`${doctor?.firstName || ''} ${doctor?.lastName || ''}`)}>
                            <DocumentDuplicateIcon className="h-5 w-5 text-gray-300 hover:text-amber-500" />
                        </button>
                        <button onClick={handleGoogleSearch}>
                            <SparklesIcon className="h-5 w-5 text-gray-300 hover:text-amber-500" />
                        </button>
                    </div>
                </p>
            )}

            {/* Address with Google Maps link and copy button */}
            {doctor?.address && (
                <p className="flex justify-between items-center">
                    <span><strong>Adresse:</strong> {doctor?.address}, {doctor?.postalCode || ''} {doctor?.city || ''}</span>
                    <div className="flex space-x-2">
                        <button onClick={() => handleCopy(`${doctor?.address || ''}, ${doctor?.postalCode || ''} ${doctor?.city || ''}`)}>
                            <DocumentDuplicateIcon className="h-5 w-5 text-gray-300 hover:text-amber-500" />
                        </button>
                        <a
                            href={`https://www.google.com/maps?q=${doctor?.address || ''}, ${doctor?.postalCode || ''} ${doctor?.city || ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <MapPinIcon className="h-5 w-5 text-gray-300 hover:text-amber-500" />
                        </a>
                    </div>
                </p>
            )}

            {/* Phone with call icon and copy button */}
            {doctor?.phoneNr && (
                <p className="flex justify-between items-center">
                    <span><strong>Telefon:</strong> {doctor?.phoneNr}</span>
                    <div className="flex space-x-2">
                        <button onClick={() => handleCopy(doctor?.phoneNr || '')}>
                            <DocumentDuplicateIcon className="h-5 w-5 text-gray-300 hover:text-amber-500" />
                        </button>
                        <a href={`tel:${doctor?.phoneNr}`}>
                            <PhoneIcon className="h-5 w-5 text-gray-300 hover:text-amber-500" />
                        </a>
                    </div>
                </p>
            )}

            {/* Email with mail icon and copy button */}
            {doctor?.hinIds?.[0]?.email && (
                <p className="flex justify-between items-center">
                    <span><strong>E-Mail:</strong> {doctor?.hinIds?.[0].email}</span>
                    <div className="flex space-x-2">
                        <button onClick={() => handleCopy(doctor?.hinIds?.[0]?.email || '')}>
                            <DocumentDuplicateIcon className="h-5 w-5 text-gray-300 hover:text-amber-500" />
                        </button>
                        <a href={`mailto:${doctor?.hinIds?.[0]?.email}`}>
                            <EnvelopeIcon className="h-5 w-5 text-gray-300 hover:text-amber-500" />
                        </a>
                    </div>
                </p>
            )}

            {/* Specialist Titles */}
            {doctor?.specialistTitles && doctor?.specialistTitles.length > 0 && (
                <div>
                    <h4 className="font-semibold">Fachgebiete:</h4>
                    <ul className="list-disc list-inside">
                        {doctor?.specialistTitles.map((title, idx) => (
                            <li key={idx}>{title.specialityText}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DoctorDetails;
