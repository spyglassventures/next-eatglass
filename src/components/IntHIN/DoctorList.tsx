import React from 'react';
import Image from 'next/image'; // for logo in vcf
import DoctorDetails from './DoctorDetails';
import DoctorRow from './DoctorRow'; // New Row Component
import { Doctor, DetailedDoctor } from './types';
import { ClipboardIcon, PhoneIcon, MapPinIcon, EnvelopeIcon, DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import { sanitizeFileNameImport, sanitizeVCFField, mapLanguageCode, getLanguageFlag } from './mappings'; // Utility imports
import { imageBase64, sanitizeFileName, quotedPrintableEncode } from './doctorUtils'; // Import utility functions


type DoctorListProps = {
    doctors: Doctor[];
    detailedDoctors: { [key: string]: DetailedDoctor };
    searchInProgress: boolean;
    hasSearched: boolean; // New prop to track whether a search has been initiated
};
// Google search function
const handleGoogleSearch = (doctor: DetailedDoctor) => {
    // Construct the query to always include displayName, address, and postalCode
    const query = `${doctor.displayName || ''} ${doctor.address || ''} ${doctor.postalCode || ''} ${doctor.city || ''}`;

    // Create the Google search URL
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    // Open the search URL in a new tab
    window.open(googleSearchUrl, '_blank');
};


const DoctorList: React.FC<DoctorListProps> = ({ doctors, detailedDoctors, searchInProgress, hasSearched }) => {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    // Generate and download the VCF file for the doctor
    const handleDownloadVCF = (doctor: DetailedDoctor) => {
        // Function to sanitize names and addresses for VCF content (FN, N, ORG, ADR)
        const sanitizeVCFText = (text: string) => {
            return text
                .replace(/[äÄ]/g, 'ae')
                .replace(/[öÖ]/g, 'oe')
                .replace(/[üÜ]/g, 'ue')
                .replace(/[ß]/g, 'ss')
                .normalize('NFD') // Decompose accents from characters
                .replace(/[\u0300-\u036f]/g, ''); // Remove diacritical marks (accents)
        };

        // Sanitize file name for download
        const sanitizeFileName = (name: string) => {
            return name
                .replace(/[äÄ]/g, 'ae')
                .replace(/[öÖ]/g, 'oe')
                .replace(/[üÜ]/g, 'ue')
                .replace(/[ß]/g, 'ss')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks (accents)
                .replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, '') // Remove hyphens and special characters
                .replace(/\s+/g, '_'); // Replace spaces with underscores
        };

        const sanitizedFirstName = sanitizeFileName(doctor.firstName || '');
        const sanitizedLastName = sanitizeFileName(doctor.lastName || '');

        // Combine Title and Fachgebiete (specialty)
        const combinedTitleAndSpecialties = `${doctor.academicTitle || ''} ${doctor.specialistTitles?.map(s => s.specialityText).join(', ') || ''}`.trim();

        // Construct VCF content, applying sanitization to FN, N, ORG, and ADR fields
        let vcfContent = '';
        vcfContent += 'BEGIN:VCARD\n';
        vcfContent += 'VERSION:4.0\n';
        vcfContent += `FN:${sanitizeVCFText(doctor.firstName || '')} ${sanitizeVCFText(doctor.lastName || '')}\n`;
        vcfContent += `N:${sanitizeVCFText(doctor.lastName || '')};${sanitizeVCFText(doctor.firstName || '')};;;\n`;
        vcfContent += `TITLE:${sanitizeVCFText(combinedTitleAndSpecialties)}\n`; // Add combined title and specialties
        vcfContent += `ORG:${sanitizeVCFText(doctor.displayName || '')}\n`;

        // Add Dachorganisation (if available)
        if (doctor.parents && doctor.parents.length > 0) {
            const parentOrg = doctor.parents.map(parent => sanitizeVCFText(parent.name)).join(', ');
            vcfContent += `NOTE:Dachorganisation ${parentOrg}\n`;
        }

        // Add GLN (if available)
        if (doctor.gln) {
            vcfContent += `NOTE:GLN ${doctor.gln}\n`;
        }

        // Add language preference (if available)
        if (doctor.languageCode) {
            vcfContent += `LANG:${mapLanguageCode(doctor.languageCode)}\n`; // Map the language code to a readable format
        }

        vcfContent += `EMAIL;TYPE=WORK:${doctor.hinIds?.[0]?.email || ''}\n`;
        vcfContent += `TEL;TYPE=WORK,VOICE:${doctor.phoneNr || ''}\n`;
        vcfContent += `ADR;TYPE=WORK:${sanitizeVCFText(doctor.address || '')};${sanitizeVCFText(doctor.city || '')};${doctor.postalCode || ''}\n`;
        vcfContent += `PHOTO;ENCODING=b;TYPE=PNG:${imageBase64}\n`;
        // Combine GLN, Dachorganisation, and language preference into the NOTE field
        let noteContent = 'data by DocDialog.ch and HIN';

        if (doctor.parents && doctor.parents.length > 0) {
            const parentOrg = doctor.parents.map(parent => sanitizeVCFText(parent.name)).join(', ');
            noteContent += `, Dachorganisation: ${parentOrg}`;
        }

        if (doctor.gln) {
            noteContent += `, GLN: ${doctor.gln}`;
        }

        if (doctor.languageCode) {
            noteContent += `, Bevorzugte Sprache: ${mapLanguageCode(doctor.languageCode)}`;
        }

        // Add the concatenated note content to the VCF
        vcfContent += `NOTE:${noteContent}\n`;

        vcfContent += 'END:VCARD';

        const blob = new Blob([vcfContent], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Download sanitized VCF file with proper filename
        link.download = `${sanitizedFirstName}_${sanitizedLastName}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };









    // Handle copying the entire doctor's information
    const handleCopyFullCardInfo = (doctor: DetailedDoctor) => {
        const fullInfo = `
Name: ${doctor.academicTitle || ''} ${doctor.firstName || ''} ${doctor.lastName || ''}
Email: ${doctor.hinIds?.[0]?.email || ''}
Telefon: ${doctor.phoneNr || ''}
Adresse: ${doctor.address || ''}, ${doctor.postalCode || ''} ${doctor.city || ''}
GLN: ${doctor.gln || ''}
Bevorzugte Sprache: ${mapLanguageCode(doctor.languageCode)}
Dachorganisation: ${doctor.parents?.map((parent) => parent.name).join(', ') || 'Keine bekannt'}
Zugehörige Teilnehmer: ${doctor.children?.map((child) => child.name).join(', ') || 'Keine bekannt'}
        `;
        handleCopy(fullInfo.trim());
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-7">
                {searchInProgress ? (
                    <p className="text-gray-700 dark:text-gray-300">Suche läuft...</p>
                ) : doctors.length > 0 ? (
                    doctors.map((doctor) => (
                        <div
                            key={doctor.integrationId}
                            className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition relative pb-9"
                        >
                            {/* Full card copy button in the top right corner */}
                            <button
                                className="absolute top-2 right-2"
                                onClick={() => handleCopyFullCardInfo(detailedDoctors[doctor.integrationId])}
                            >
                                <ClipboardIcon className="h-5 w-5 cursor-pointer text-gray-300 hover:text-amber-500" />
                            </button>

                            <h3 className="font-bold mb-2">{doctor.displayName || 'Kein Name bekannt'}</h3>
                            <p className="text-sm mb-2 flex justify-between items-center text-gray-700 dark:text-gray-300">
                                <span>{doctor.city || 'Keine Stadt bekannt'}</span>
                                <button onClick={() => handleGoogleSearch(detailedDoctors[doctor.integrationId])} className="ml-2">
                                    <Image
                                        src="/images/brands/google.png"
                                        alt="Google Search"
                                        width={16}
                                        height={16}
                                        className="opacity-20"
                                    />

                                </button>
                            </p>
                            {detailedDoctors[doctor.integrationId] ? (
                                <>
                                    <DoctorDetails doctor={detailedDoctors[doctor.integrationId]} />

                                    {/* Doctor Rows with Copy Functionality */}
                                    <DoctorRow
                                        label="Titel"
                                        value={detailedDoctors[doctor.integrationId].academicTitle || 'Kein Titel bekannt'}
                                        onCopy={() => handleCopy(detailedDoctors[doctor.integrationId].academicTitle || '')}
                                    />
                                    <DoctorRow
                                        label="GLN"
                                        value={detailedDoctors[doctor.integrationId].gln || 'Keine GLN bekannt'}
                                        onCopy={() => handleCopy(detailedDoctors[doctor.integrationId].gln || '')}
                                    />
                                    <DoctorRow
                                        label="Bevorzugte Sprache"
                                        value={getLanguageFlag(detailedDoctors[doctor.integrationId].languageCode)} // Flag instead of text
                                        onCopy={() => handleCopy(mapLanguageCode(detailedDoctors[doctor.integrationId].languageCode))}
                                    />
                                    <DoctorRow
                                        label="Dachorganisation"
                                        value={detailedDoctors[doctor.integrationId].parents?.map((parent) => parent.name).join(', ') || 'Keine bekannt'}
                                        onCopy={() => handleCopy(detailedDoctors[doctor.integrationId].parents?.map((parent) => parent.name).join(', ') || '')}
                                    />
                                    <DoctorRow
                                        label="Zugehörige Teilnehmer"
                                        value={detailedDoctors[doctor.integrationId].children?.map((child) => child.name).join(', ') || 'Keine bekannt'}
                                        onCopy={() => handleCopy(detailedDoctors[doctor.integrationId].children?.map((child) => child.name).join(', ') || '')}
                                    />

                                    {/* VCF Download */}
                                    <button
                                        className="absolute bottom-2 right-2 text-sm text-gray-300 hover:text-amber-500 p-1"
                                        onClick={() => handleDownloadVCF(detailedDoctors[doctor.integrationId])}
                                    >
                                        VCF
                                    </button>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">Lade detaillierte Informationen...</p>
                            )}
                        </div>
                    ))
                ) : searchInProgress ? (
                    <p className="text-gray-700 dark:text-gray-300">Die Suche läuft, bitte warten...</p>
                ) : hasSearched && doctors.length === 0 ? (
                    <p className="text-gray-700 dark:text-gray-300">Keine Teilnehmer gefunden, bitte Suche anpassen.</p>
                ) : hasSearched && doctors.length > 0 ? (
                    // Render the doctor list here, or map through doctors
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-7">
                        {doctors.map((doctor) => (
                            <div
                                key={doctor.integrationId}
                                className="bg-gray-100 p-4 rounded-lg shadow-md hover:bg-gray-200 transition relative pb-9"
                            >
                                {/* Doctor Card */}
                                {/* ... your doctor card content */}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-700 dark:text-gray-300">Keine Ergebnisse oder Suche noch nicht erfolgt. Ggf. Suchbegriff anpassen. Klicken Sie Suchen um die Suchergebnisse hier anzuzeigen.</p>
                )}
            </div>

            {/* Legend */}
            <div className="mt-6">
                <h4 className="font-semibold text-lg">Legende:</h4>
                <p>
                    <ClipboardIcon className="inline h-5 w-5 text-gray-300" /> - Kopieren Sie die Informationen dieses Arztes
                </p>
                <p>
                    <DocumentDuplicateIcon className="inline h-5 w-5 text-gray-300" /> - Kopieren Sie der Zeile
                </p>
                <p>
                    <PhoneIcon className="inline h-5 w-5 text-gray-300" /> - Anrufen (Skype, Teams, Facetime, Telefon-App öffnet)
                </p>
                <p>
                    <EnvelopeIcon className="inline h-5 w-5 text-gray-300" /> - E-Mail senden (z.B. Outlook)
                </p>
                <p>
                    <MapPinIcon className="inline h-5 w-5 text-gray-300" /> - Auf Google Maps anzeigen
                </p>
                <p>
                    <span className="text-sm text-gray-300">VCF</span> - Kontakt als VCF herunterladen (zum Hinzufügen in Ihrem Adressbuch)
                </p>
            </div>
        </div>
    );
};

export default DoctorList;


// issue Cabinet pédiatrie Dr. Amaya Clement Vallélian not copiable