import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import mailerConfig from 'src/config/mailerPageConfig.json';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// React Quill modules for extended functionality
const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'code-block'],
        ['clean'],
    ],
};

const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'code-block',
];

export default function EmailModal({
    defaultMessage,
    defaultRecipients,
    defaultSubject,
    onClose,
}: {
    defaultMessage: string;
    defaultRecipients: string[];
    defaultSubject: string;
    onClose: () => void;
}) {
    const [recipients, setRecipients] = useState<string[]>(defaultRecipients);
    const [ccRecipients, setCcRecipients] = useState<string[]>([]);
    const [newRecipient, setNewRecipient] = useState('');
    const [newCcRecipient, setNewCcRecipient] = useState('');
    const [message, setMessage] = useState(defaultMessage);
    // const [subject, setSubject] = useState(defaultSubject);

    const [subject, setSubject] = useState('');
    useEffect(() => {
        const currentDate = format(new Date(), 'dd.MM.yyyy');
        setSubject(defaultSubject.replace('{{date}}', currentDate));
    }, [defaultSubject]);

    const [feedback, setFeedback] = useState('');

    // Error checking for invalid email addresses
    const [recipientError, setRecipientError] = useState('');
    const [ccRecipientError, setCcRecipientError] = useState('');


    // useEffect(() => {
    //     const subjectTemplate = mailerConfig.emailDefaults?.subjectTemplate || '';
    //     const currentDate = format(new Date(), 'dd.MM.yyyy');
    //     setSubject(subjectTemplate.replace('{{date}}', currentDate));
    // }, []);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(email.trim());
    };

    const handleAddEmail = (type: 'to' | 'cc') => {
        const newEmail = type === 'to' ? newRecipient : newCcRecipient;
        const setEmails = type === 'to' ? setRecipients : setCcRecipients;
        const setError = type === 'to' ? setRecipientError : setCcRecipientError;
        const emails = type === 'to' ? recipients : ccRecipients;

        if (!validateEmail(newEmail)) {
            setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return;
        }

        if (emails.includes(newEmail.trim())) {
            setError('Diese E-Mail-Adresse wurde bereits hinzugefügt.');
            return;
        }

        setEmails([...emails, newEmail.trim()]);
        type === 'to' ? setNewRecipient('') : setNewCcRecipient('');
        setError(''); // Clear error after successful addition
    };


    const handleKeyPress = (
        e: React.KeyboardEvent<HTMLInputElement>,
        type: 'to' | 'cc'
    ) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddEmail(type);
        }
    };

    const removeRecipient = (email: string, type: 'to' | 'cc') => {
        const setEmails = type === 'to' ? setRecipients : setCcRecipients;
        const emails = type === 'to' ? recipients : ccRecipients;

        setEmails(emails.filter((r) => r !== email));
    };

    const sendEmail = async () => {
        try {
            const response = await fetch('/api/sendgrid_contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recipients, ccRecipients, subject, message }),
            });
            if (response.ok) {
                setFeedback('E-Mail wurde erfolgreich gesendet!');
            } else {
                setFeedback('Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.');
            }
        } catch (error) {
            console.error('Fehler beim Senden der E-Mail:', error);
            setFeedback('Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.');
        }
    };

    const handleShortcut = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.ctrlKey && e.key === 'Enter') {
            sendEmail();
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 dark:bg-black dark:bg-opacity-80"
            onKeyDown={handleShortcut}
            tabIndex={-1}
        >
            <div className="relative bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-[80%] max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-300 dark:border-gray-700">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    aria-label="Schließen"
                >
                    &#x2715;
                </button>

                <h2 className="text-xl font-light mb-6 text-gray-900 dark:text-gray-100 text-center">
                    E-Mail senden
                </h2>

                {feedback && (
                    <div
                        className={`mb-4 p-3 rounded-md text-sm ${feedback.includes('erfolgreich')
                            ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                    >
                        {feedback}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                            Betreff:
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full border rounded-md p-3 text-sm dark:bg-gray-800 dark:border-gray-700"
                        />
                    </div>

                    {/* Recipients */}
                    <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                            Empfänger:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {recipients.map((email, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md text-sm flex items-center"
                                >
                                    {email}
                                    <button
                                        onClick={() => removeRecipient(email, 'to')}
                                        className="ml-2 text-red-500 hover:underline"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 flex space-x-2">
                            <input
                                type="email"
                                value={newRecipient}
                                onChange={(e) => setNewRecipient(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, 'to')}
                                placeholder="Empfänger hinzufügen"
                                className="flex-1 border p-3 rounded-md text-sm dark:bg-gray-800 dark:border-gray-700"
                            />
                            <button
                                onClick={() => handleAddEmail('to')}
                                className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
                            >
                                Hinzufügen
                            </button>
                        </div>
                        {recipientError && (
                            <p className="text-red-600 text-sm mt-1">{recipientError}</p>
                        )}
                    </div>

                    {/* CC Recipients */}
                    <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                            CC:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {ccRecipients.map((email, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md text-sm flex items-center"
                                >
                                    {email}
                                    <button
                                        onClick={() => removeRecipient(email, 'cc')}
                                        className="ml-2 text-red-500 hover:underline"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 flex space-x-2">
                            <input
                                type="email"
                                value={newCcRecipient}
                                onChange={(e) => setNewCcRecipient(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, 'cc')}
                                placeholder="CC hinzufügen"
                                className="flex-1 border p-3 rounded-md text-sm dark:bg-gray-800 dark:border-gray-700"
                            />
                            <button
                                onClick={() => handleAddEmail('cc')}
                                className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
                            >
                                Hinzufügen
                            </button>
                        </div>
                        {ccRecipientError && (
                            <p className="text-red-600 text-sm mt-1">{ccRecipientError}</p>
                        )}
                    </div>


                    {/* Message */}
                    <div>
                        <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">
                            Nachricht:
                        </label>
                        <div className="h-[300px] overflow-y-auto border rounded-md dark:bg-gray-800 dark:border-gray-700">
                            <ReactQuill
                                value={message}
                                onChange={setMessage}
                                modules={quillModules}
                                formats={quillFormats}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Drücken Sie <strong>Strg + Enter</strong>, um die E-Mail zu senden.
                        </p>
                        <div className="flex space-x-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={sendEmail}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                            >
                                Senden
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
