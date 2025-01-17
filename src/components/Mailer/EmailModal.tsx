import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import mailerConfig from 'src/config/mailerPageConfig.json';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

// Utility function to format content
const formatContent = (text: string): string => {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold formatting
        .replace(/- ([^\n]+)/g, '<li>$1</li>') // Bullet points
        .replace(/(\d+\..+?:)/g, '<strong>$1</strong>') // Bold headings (e.g., 1., 2.)
        .replace(/\n/g, '<br>') // New lines
        .replace(/<li>/g, '<ul><li>').replace(/<\/li>(?!<\/ul>)/g, '</li></ul>'); // Wrap bullets in <ul>
};

export default function EmailModal({
    defaultMessage,
    defaultRecipients,
    onClose,
}: {
    defaultMessage: string;
    defaultRecipients: string[];
    onClose: () => void;
}) {
    const [recipients, setRecipients] = useState<string[]>(defaultRecipients);
    const [newRecipient, setNewRecipient] = useState('');
    const [message, setMessage] = useState(defaultMessage);
    const [subject, setSubject] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        // Set default subject and format content
        const subjectTemplate = mailerConfig.emailDefaults?.subjectTemplate || '';
        const currentDate = format(new Date(), 'dd.MM.yyyy');
        setSubject(subjectTemplate.replace('{{date}}', currentDate));
        setMessage(formatContent(defaultMessage));
    }, [defaultMessage]);

    const addRecipient = () => {
        if (newRecipient.trim() && !recipients.includes(newRecipient)) {
            setRecipients([...recipients, newRecipient]);
            setNewRecipient('');
        }
    };

    const removeRecipient = (email: string) => {
        setRecipients(recipients.filter((r) => r !== email));
    };

    const sendEmail = async () => {
        try {
            const response = await fetch('/api/sendgrid_contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ recipients, subject, message }),
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

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 dark:bg-black dark:bg-opacity-80">
            <div className="relative bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-[70%] max-w-4xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    aria-label="Schließen"
                >
                    &#x2715;
                </button>

                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                    E-Mail senden
                </h2>

                {feedback && (
                    <div
                        className={`mb-4 p-4 rounded-md ${feedback.includes('erfolgreich')
                                ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                    >
                        {feedback}
                    </div>
                )}

                {/* Subject */}
                <div className="mb-6">
                    <label
                        htmlFor="subject"
                        className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
                    >
                        Betreff:
                    </label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="border w-full p-2 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Recipients */}
                <div className="mb-6">
                    <label
                        htmlFor="recipients"
                        className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
                    >
                        Empfänger:
                    </label>
                    <ul className="list-disc pl-5 space-y-2">
                        {recipients.map((email, index) => (
                            <li key={index} className="flex justify-between items-center text-gray-800 dark:text-gray-200">
                                {email}
                                <button
                                    className="text-red-600 text-sm dark:text-red-400 hover:underline"
                                    onClick={() => removeRecipient(email)}
                                >
                                    Entfernen
                                </button>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="email"
                        value={newRecipient}
                        onChange={(e) => setNewRecipient(e.target.value)}
                        placeholder="Zusätzlichen Empfänger hinzufügen"
                        className="border w-full mt-3 p-2 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={addRecipient}
                        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-gray-100"
                    >
                        Hinzufügen
                    </button>
                </div>

                {/* Message */}
                <div className="mb-6 h-60 overflow-y-auto border rounded-md p-4 dark:bg-gray-800 dark:border-gray-700">
                    <label
                        htmlFor="message"
                        className="block mb-2 font-medium text-gray-700 dark:text-gray-300"
                    >
                        Nachricht:
                    </label>
                    <ReactQuill
                        value={message}
                        onChange={setMessage}
                        className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-2 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={sendEmail}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-gray-100"
                    >
                        Senden
                    </button>
                </div>
            </div>
        </div>
    );
}
