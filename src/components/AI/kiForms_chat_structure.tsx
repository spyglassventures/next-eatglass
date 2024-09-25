'use client'

import { useEffect, useRef, useState } from 'react'
import CopyToClipboard from '@/components/copy-to-clipboard'
import FeedbackModal from './FeedbackModal'
import { FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa'
import './styles.css';

const FormatMessageContent = ({ content }) => {
    return content.split('**').map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
};

const Message = ({ message }) => (
    <div key={message.id} className='mr-6 whitespace-pre-wrap md:mr-12 p-2 '>
        {message.role === 'user' && (
            <div className='flex gap-3 relative right-0 justify-end'>
                <div className='bg-blue-100 dark:bg-blue-900 p-3 rounded-md '>
                    <p className='font-semibold text-blue-800 dark:text-blue-300'>Ihre Eingabe:</p>
                    <div className='mt-1.5 text-sm text-blue-700 dark:text-blue-200'>
                        <FormatMessageContent content={message.content} />
                    </div>
                </div>
            </div>
        )}
        {message.role === 'assistant' && (
            <div className='flex gap-3'>
                <div className='w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-md'>
                    <div className='flex justify-between'>
                        <p className='font-semibold text-green-800 dark:text-green-300'>Copilot</p>
                    </div>
                    <div className='mt-2 text-sm text-green-700 dark:text-green-200'>
                        <FormatMessageContent content={message.content} />
                    </div>
                </div>
            </div>
        )}
    </div>
);

const countTokens = (text) => {
    return text.split(/\s+/).filter(Boolean).length;
};

const getTokenStatus = (tokens) => {
    if (tokens > 5000) {
        return { color: 'text-red-600', message: 'Zu viele Wörter', icon: <FaTimesCircle className='text-red-600' /> };
    } else if (tokens > 3500) {
        return { color: 'text-orange-300', message: 'Eventuell zu viele Wörter', icon: <FaExclamationTriangle className='text-orange-500' /> };
    } else {
        return { color: 'text-green-600', message: 'Eingabe gut', icon: <FaCheckCircle className='text-green-600' /> };
    }
};

export default function ChatStructure({
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    warningMessage,
    placeHolderInput,
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
    const [hasAnswer, setHasAnswer] = useState(false);
    const [cleanWords, setCleanWords] = useState('');
    const [removedWords, setRemovedWords] = useState<{ word: string, count: number }[]>([]);
    const [showPasteCheck, setShowPasteCheck] = useState(true);
    const [showRemovedWords, setShowRemovedWords] = useState(false);  // To toggle "Entfernte Wörter" section

    const tokenCount = countTokens(input);
    const tokenStatus = getTokenStatus(tokenCount);

    useEffect(() => {
        if (ref.current === null) return;
        ref.current.scrollTo(0, ref.current.scrollHeight);
    }, [messages]);

    const cleanInput = (text) => {
        const wordsToClean = cleanWords.split(',').map(word => word.trim());
        let cleanedText = text;
        const wordCounts = {};

        wordsToClean.forEach((word) => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = text.match(regex);
            const count = matches ? matches.length : 0;
            wordCounts[word] = count;
            cleanedText = cleanedText.replace(regex, '');
        });

        const removedWordData = wordsToClean
            .filter(word => wordCounts[word] > 0)
            .map(word => ({ word, count: wordCounts[word] }));

        setRemovedWords(removedWordData);
        return cleanedText;
    };

    const handlePaste = (event) => {
        if (showPasteCheck && cleanWords.trim()) {
            event.preventDefault();
            const pastedText = event.clipboardData.getData('text');
            const cleanedText = cleanInput(pastedText);
            setInput(cleanedText);
        }
    };

    const handleCleanAgain = () => {
        setInput(cleanInput(input));
        setShowRemovedWords(true); // Show the "Entfernte Wörter" section after cleaning
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(e);
    };

    return (
        <section className='py-1 text-zinc-700 dark:text-zinc-300'>
            <div className='p-0'>
                <div className='flex flex-wrap items-center mb-3'>
                    <div className='w-full md:w-2/3'>
                        <p className='text-m text-zinc-600 dark:text-zinc-400'>
                            {warningMessage}
                        </p>
                    </div>
                    <div className='w-full md:w-1/3 pl-3'>
                        {hasAnswer && (
                            <div className='flex justify-left items-center p-0 '>
                                <CopyToClipboard message={messages[messages.length - 1]} />
                            </div>
                        )}
                    </div>
                </div>

                <div className='flex flex-wrap mb-3 '>
                    <div className='w-full md:w-2/3 mb-3 md:mb-0'>
                        <div
                            className='h-[500px] rounded-md border dark:border-zinc-700 overflow-auto bg-white dark:bg-zinc-900 p-4 '
                            ref={ref}
                        >
                            {messages.map((m) => <Message key={m.id} message={m} />)}
                        </div>
                    </div>

                    <div className="w-full md:w-1/3 pl-3 hidden md:block">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-md max-h-[500px] overflow-y-auto p-2 text-sm">
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Ablauf für beste Zeitersparnis:</p>
                            <ul className="list-disc pl-4 space-y-1 text-zinc-700 dark:text-zinc-300">
                                <li>Wählen Sie das passende Formular unter &quot;KI Formulare&quot;.</li>
                                <li>Exportieren Sie den Verlauf aus dem Praxisprogramm (F5, Zeitraum auswählen), markieren und kopieren.</li>
                                <li>Fügen Sie den Verlauf in das Eingabefeld unten links ein.</li>
                                <li>Entfernen Sie den Patientennamen mit den Filteroptionen (Name, Vorname), dann &quot;Eingabe bereinigen&quot; klicken.</li>
                                <li>Eingabe ist bereinigt. Nun mit Enter absenden.</li>
                                <li>KI generiert nun den Formulartext. Klicken Sie auf &quot;Formular anzeigen und aktualisieren&quot;, Text ergänzen/korrigieren und &quot;Übertragen in Word&quot;.</li>
                            </ul>

                            <p className="font-semibold text-zinc-900 dark:text-zinc-100 mt-5 mb-1">Filteroptionen:</p>
                            <label className="flex items-center space-x-1 mb-1">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={showPasteCheck}
                                    onChange={() => setShowPasteCheck(!showPasteCheck)}
                                />
                                <span className="text-xs">Text-Bereinigung aktivieren</span>
                            </label>
                            <div className="mt-1">
                                <p className="text-xs">Zu entfernende Wörter (kommagetrennt):</p>
                                <input
                                    type="text"
                                    value={cleanWords}
                                    onChange={(e) => setCleanWords(e.target.value)}
                                    className="w-full mt-1 p-1 rounded-md dark:bg-zinc-800 dark:text-zinc-300"
                                    placeholder="Wörter eingeben...z.B. Max, Muster"
                                />
                            </div>
                            <button
                                onClick={handleCleanAgain}
                                className='mt-2 bg-emerald-500 text-white rounded px-3 py-1 text-xs'
                            >
                                Eingabe bereinigen
                            </button>

                            {showRemovedWords && (  // Show "Entfernte Wörter" section only after button click
                                <div className="mt-2">
                                    <p className="font-semibold text-xs">Entfernte Wörter:</p>
                                    <ul className="list-disc pl-4 text-xs">
                                        {removedWords.map((wordData, index) => (
                                            <li key={index}>
                                                {wordData.word} - {wordData.count} mal entfernt
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-xs mt-2">Sie können den Text nun mit Enter zur KI schicken.</p>
                                </div>
                            )}
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100 mt-5 mb-1">Anleitung als PDF (öffnet in neuem Fenster):</p>
                            <a href="https://drive.google.com/file/d/1OpXO2yF2CWD5GCea3BmZt-gQ2Tb63kht/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-blue-500">Hier klicken, um die Anleitung zu öffnen</a>

                        </div>
                    </div>
                </div>

                <div className='flex flex-wrap items-center mt-2 pb-0'>
                    <div className='w-full md:w-2/3'>
                        <form onSubmit={onSubmit} className='relative'>
                            <textarea
                                name='message'
                                value={input}
                                onChange={handleInputChange}
                                onPaste={handlePaste}
                                placeholder={placeHolderInput}
                                className='w-full p-2 placeholder:italic border placeholder:text-zinc-600/75 focus-visible:ring-zinc-500 text-left dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-400 rounded-md resize-none'
                                rows={1}
                            />
                            <button
                                type="submit"
                                className={`absolute right-1 top-1 h-8 w-20 bg-emerald-500 text-white rounded flex items-center justify-center `}
                            >
                                Enter
                            </button>
                        </form>
                    </div>

                    <div className='w-full md:w-1/3 flex items-start pl-2 pb-2 justify-center md:justify-start md:flex'>
                        <button
                            className='h-9 w-full bg-gray-600 text-white flex items-center justify-center px-4 rounded-md resize-none border'
                            onClick={() => setShowSuggestionsModal(true)}
                        >
                            Was können wir besser machen?
                        </button>
                    </div>
                </div>
            </div>
            <FeedbackModal showModal={showSuggestionsModal} setShowModal={setShowSuggestionsModal} />
            <p className={`mt-2 text-sm ${tokenStatus.color} flex items-center`}>
                {tokenStatus.icon} <span className="ml-2">{tokenStatus.message}</span>: {tokenCount}
            </p>
        </section>
    );
}
