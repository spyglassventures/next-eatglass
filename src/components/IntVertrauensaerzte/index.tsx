import React, { useState, useEffect } from 'react';
import documents from '../../config/InternalDocuments/Vertrauensaerzte'; // Import the document configuration
import { ClipboardIcon, EyeIcon, EyeSlashIcon, LinkIcon, DocumentDuplicateIcon, ExclamationTriangleIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import EmailModal from '../Mailer/EmailModal'; // Import the EmailModal component
import mailerConfig from 'src/config/mailerPageConfig.json'; // Configuration file containing email defaults
import { format } from 'date-fns';

const defaultCC = mailerConfig.recipients?.emails || [];

export default function InternalDocuments() {
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedCard, setCopiedCard] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [revealedPassword, setRevealedPassword] = useState<{ [key: string]: boolean }>({});
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    // const [ccEmails, setCcEmails] = useState(defaultCC);
    const [ccEmails, setCcEmails] = useState<string[]>([]);
    const [subject, setSubject] = useState('');

    useEffect(() => {
        // Load CC emails from configuration
        const defaultCC = mailerConfig.recipients?.emails || [];
        setCcEmails(defaultCC);
    }, []);

    const filteredDocuments = documents.filter((doc) =>
        doc.partnerart.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleCardCopy = (docIdx: string, details: { label: string; value: string; type: 'text' | 'password' | 'url'; copyable?: boolean }[]) => {
        const textToCopy = details
            .filter(detail => detail.type !== 'password')
            .map(detail => `${detail.label}: ${detail.value}`)
            .join('\n');

        handleCopy(textToCopy);
        setCopiedCard(docIdx);
        setTimeout(() => setCopiedCard(null), 2000);
    };

    const handleFieldCopy = (fieldIdx: string, text: string) => {
        handleCopy(text);
        setCopiedField(fieldIdx);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const togglePasswordVisibility = (index: string) => {
        setRevealedPassword((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleEmailClick = (email: string) => {
        setEmail(email);

        // Generate subject using emailDefaultsVertrauensarzt.subjectTemplate
        const subjectTemplate = mailerConfig.emailDefaultsVertrauensarzt?.subjectTemplate || '';
        const currentDate = format(new Date(), 'dd.MM.yyyy');
        const generatedSubject = subjectTemplate.replace('{{date}}', currentDate);

        setSubject(generatedSubject);
        setIsEmailModalOpen(true);
    };

    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Suche nach Partnerart..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4 md:mb-0"
                    />
                    <div className="flex items-center ml-4 text-red-600">
                        <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                        <span className="text-sm font-semibold">
                            Testphase - bitte noch keine Patientendaten ohne Verifizierung übermitteln.
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((doc, docIdx) => (
                        <div
                            key={doc.partnerart}
                            className="bg-gray-100 p-2 rounded-lg shadow-md hover:bg-gray-200 transition relative"
                        >
                            <button
                                className="absolute top-2 right-2"
                                onClick={() => handleCardCopy(doc.partnerart, doc.details)}
                            >
                                <ClipboardIcon
                                    className={`h-5 w-5 cursor-pointer transition-colors ${copiedCard === doc.partnerart ? 'text-blue-500' : 'text-gray-300 hover:text-amber-500'}`}
                                />
                            </button>
                            <h3 className="font-bold mb-2">{doc.partnerart}</h3>
                            {doc.details.map((detail, idx) => (
                                <div key={`${doc.partnerart}-${idx}`} className="mb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold text-sm text-gray-700">
                                                {detail.label}:
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {detail.type === 'password' && !revealedPassword[`${doc.partnerart}-${idx}`]
                                                    ? '****'
                                                    : detail.value}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {detail.copyable && detail.type !== 'url' && (
                                                <DocumentDuplicateIcon
                                                    className={`h-5 w-5 cursor-pointer transition-colors ${copiedField === `${doc.partnerart}-${idx}` ? 'text-blue-500' : 'text-gray-300 hover:text-amber-500'}`}
                                                    onClick={() => handleFieldCopy(`${doc.partnerart}-${idx}`, detail.value)}
                                                />
                                            )}
                                            {detail.type === 'password' && (
                                                <button onClick={() => togglePasswordVisibility(`${doc.partnerart}-${idx}`)}>
                                                    {revealedPassword[`${doc.partnerart}-${idx}`] ? (
                                                        <EyeSlashIcon className="h-5 w-5 text-gray-300" />
                                                    ) : (
                                                        <EyeIcon className="h-5 w-5 text-gray-300" />
                                                    )}
                                                </button>
                                            )}
                                            {detail.type === 'url' && detail.value && (
                                                <a
                                                    href={detail.value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center"
                                                >
                                                    <LinkIcon className="h-5 w-5 text-gray-300 cursor-pointer" />
                                                </a>
                                            )}
                                            {detail.label.toLowerCase() === 'e-mail' && detail.value && (
                                                <button onClick={() => handleEmailClick(detail.value)}>
                                                    <EnvelopeIcon className="h-5 w-5 text-gray-300 hover:text-amber-500" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">Keine Einträge gefunden.</p>
                )}
            </div>

            {/* Email Modal */}
            {isEmailModalOpen && (
                <EmailModal
                    defaultMessage={mailerConfig.emailDefaultsVertrauensarzt?.defaultMessage || ''}
                    defaultRecipients={[email]} // Primary recipient in the "To" field
                    cc={ccEmails} // Default CC recipients from the configuration
                    defaultSubject={subject} // Dynamically generated subject
                    onClose={() => setIsEmailModalOpen(false)}
                />
            )}
        </div>
    );
}
