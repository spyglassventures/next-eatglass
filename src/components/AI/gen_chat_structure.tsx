'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import CopyToClipboard from '@/components/copy-to-clipboard'
import FeedbackModal from './FeedbackModal'
import PraeparatSearchForm from '../PraeparatSearchForm'
import { FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa' // Add more icons
import './styles.css'; // Import the styles

// Helper function to format the message content
const FormatMessageContent = ({ content }) => {
    return content.split('**').map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
};

// Styling of chat between user and copilot
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

// FollowUpButtons Component
const FollowUpButtons = ({ setInput, handlePopEffect, followupBtn }) => (
    <div className='flex justify-start mt-3 space-x-3'>
        {followupBtn.map((btnText, index) => (
            <button
                key={index}
                className='bg-gray-200 text-black px-4 py-2 rounded cursor-pointer flex items-center space-x-2'
                onClick={() => {
                    setInput(btnText);
                    handlePopEffect();
                }}
            >
                <FaLightbulb className='text-yellow-500' />
                <span>{btnText}</span>
            </button>
        ))}
    </div>
);

// Token counter function
const countTokens = (text) => {
    return text.split(/\s+/).filter(Boolean).length; // Count tokens (words)
};

// Function to determine token status
const getTokenStatus = (tokens) => {
    if (tokens > 5000) {
        return { color: 'text-red-600', message: 'Zu viele Wörter', icon: <FaTimesCircle className='text-red-600' /> };
    } else if (tokens > 3500) {
        return { color: 'text-orange-300', message: 'Eventuell zu viele Wörter', icon: <FaExclamationTriangle className='text-orange-500' /> };
    } else {
        return { color: 'text-green-600', message: 'Eingabe gut', icon: <FaCheckCircle className='text-green-600' /> };
    }
};

// Main Chat Structure Component
export default function ChatStructure({
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    warningMessage,
    followupBtn,
    placeHolderInput,
    examplesData,
    showPraeparatSearch, // Added this prop
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
    const [hasAnswer, setHasAnswer] = useState(false);
    const [showFollowUpButtons, setShowFollowUpButtons] = useState(false);
    const [isPopped, setIsPopped] = useState(false);

    const tokenCount = countTokens(input);
    const tokenStatus = getTokenStatus(tokenCount); // Get token status (color, message, icon)

    // Scroll to the bottom of the messages when a new message is added
    useEffect(() => {
        if (ref.current === null) return;
        ref.current.scrollTo(0, ref.current.scrollHeight);
    }, [messages]);

    // Show follow-up buttons and other elements when the assistant sends a message
    useEffect(() => {
        if (messages.length > 1 && messages[messages.length - 1].role === 'assistant') {
            setHasAnswer(true);
            const timer = setTimeout(() => {
                setShowFollowUpButtons(true);
                const hideTimer = setTimeout(() => {
                    setShowFollowUpButtons(false);
                }, 12000);
                return () => clearTimeout(hideTimer);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [messages]);

    // Handle form submission
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSubmit(e);
    };

    // Handle example list item click, scroll to bottom
    const handleLiClick = useCallback((text) => {
        setInput(text);
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        const offset = 280;

        window.scrollTo({
            top: currentScroll + offset,
            behavior: 'smooth'
        });

        setTimeout(() => {
            setIsPopped(true);
            setTimeout(() => setIsPopped(false), 300);
        }, 800);
    }, [setInput]);

    // pop effect for follow up question buttons
    const handlePopEffect = useCallback(() => {
        setTimeout(() => {
            setIsPopped(true);
            setTimeout(() => setIsPopped(false), 300);
        }, 400);
    }, []);

    return (
        <section className='py-1 text-zinc-700 dark:text-zinc-300'>
            <div className='p-0'>
                <div className='flex flex-wrap items-center mb-3'>
                    <div className='w-full md:w-2/3'>
                        <h1 className='font-medium text-zinc-900 dark:text-zinc-100 mb-2'></h1>
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
                        <div className='h-[500px] rounded-md border dark:border-zinc-700 overflow-auto bg-white dark:bg-zinc-900 p-4' ref={ref}>
                            {messages.length > 1 ? (
                                messages.map((m) => <Message key={m.id} message={m} />)
                            ) : (
                                <div className='flex flex-col items-center justify-center h-full'>
                                    <p className='text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-6'>
                                        Bitte geben Sie Ihre Anfrage in die Zeile unten ein
                                    </p>
                                    <div className='text-6xl  text-gray-500 dark:text-gray-400 animate-bounce'>
                                        ↓
                                    </div>
                                </div>
                            )}
                        </div>
                        {showFollowUpButtons && (
                            <FollowUpButtons setInput={setInput} handlePopEffect={handlePopEffect} followupBtn={followupBtn} />
                        )}
                    </div>

                    <div className="w-full md:w-1/3 pl-3 hidden md:block">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-md max-h-[500px] overflow-y-auto p-4">
                            {showPraeparatSearch && <PraeparatSearchForm />} {/* Conditionally render the PraeparatSearchForm */}
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Beispiele für Eingaben (klickbar zur Demo):</p>
                            <ul className="text-sm text-zinc-700 dark:text-zinc-300">
                                {examplesData.examples.map((example, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleLiClick(example)}
                                        className="cursor-pointer border border-gray-300 dark:border-gray-600 rounded-md p-1 mb-1"
                                    >
                                        {example}
                                    </li>
                                ))}
                            </ul>
                            <br />
                            <p className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Bekannte Abkürzungen:</p>
                            <ul className="text-sm text-zinc-700 dark:text-zinc-300">
                                {examplesData.abkuerzungen.map((example, index) => (
                                    <li
                                        key={index}
                                    >
                                        {example}
                                    </li>
                                ))}
                            </ul>
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
                                placeholder={placeHolderInput}
                                className='w-full p-2 placeholder:italic border placeholder:text-zinc-600/75 focus-visible:ring-zinc-500 text-left dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-400 rounded-md resize-none'
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        onSubmit(new CustomEvent('submit') as unknown as React.FormEvent<HTMLFormElement>);
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                className={`absolute right-1 top-1 h-8 w-20 bg-emerald-500 text-white rounded flex items-center justify-center button-pop ${isPopped ? 'popped' : ''}`}
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
    )
}
