'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import CopyToClipboard from '@/components/copy-to-clipboard'
import FeedbackModal from './FeedbackModal'
import PraeparatSearchForm from '../PraeparatSearchForm'
import { FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa' // Add more icons
import './styles.css'; // Import the styles

// Hiding of theme selector
import { useFilter } from '@/components/AI/FilterContext'; // Import the useFilter hook
import chatThemes from './chatThemes';
import ThemeSelector from './ThemeSelector';
import DownloadButton from './ai_utils/DownloadButton'; // Import the new DownloadButton component

import SidebarPanel from './ai_utils/sidebarPanel';
import FollowUpButtons from './ai_utils/FollowUpButtons'
import InputCloud from './ai_utils/InputCloud'


// Helper function to format the message content
const FormatMessageContent = ({ content }) => {
    // Regex to detect links like <a href="URL" target="_blank" rel="noopener noreferrer">[N]</a>
    const linkRegex = /<a href="([^"]+)" target="_blank" rel="noopener noreferrer">\[(\d+)\]<\/a>/g;

    // Split content into text and links
    const parts = content.split(linkRegex);

    return parts.map((part, index) => {
        if (index % 3 === 1) {
            // URL
            const url = part;
            const label = parts[index + 1]; // Label (e.g., [2])
            return (
                <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-300 font-extralight text-sm align-baseline ml-1"
                    style={{ fontSize: '0.8rem', verticalAlign: 'baseline' }}
                >
                    [{label}]
                </a>
            );
        } else if (index % 3 === 2) {
            // Skip the label part because it's handled with the URL above
            return null;
        }
        // Regular text
        return <span key={index}>{part}</span>;
    });
};



// Styling of chat between user and copilot
const Message = ({ message, currentTheme }) => {
    const userMessageClass = `${currentTheme?.messageUser || chatThemes.default.messageUser} p-3 rounded-md`;
    const assistantMessageClass = `${currentTheme?.messageAssistant || chatThemes.default.messageAssistant} p-3 rounded-md`;

    return (
        <div key={message.id} className="mr-6 whitespace-pre-wrap md:mr-12 p-2">
            {message.role === 'user' && (
                <div className="flex gap-3 relative right-0 justify-end">
                    <div
                        className={`${userMessageClass} ${currentTheme?.fontSize || chatThemes.default.fontSize} ${currentTheme?.fontWeight || chatThemes.default.fontWeight
                            }`}
                    >
                        <p className="font-semibold">Ihre Eingabe:</p>
                        <div className="mt-1.5">
                            <FormatMessageContent content={message.content} />
                        </div>
                    </div>
                </div>
            )}
            {message.role === 'assistant' && (
                <div className="flex gap-3">
                    <div
                        className={`${assistantMessageClass} ${currentTheme?.fontSize || chatThemes.default.fontSize} ${currentTheme?.fontWeight || chatThemes.default.fontWeight
                            }`}
                    >
                        <div className="flex justify-between">
                            <p className="font-semibold">Copilot</p>
                        </div>
                        <div className="mt-2">
                            <FormatMessageContent content={message.content} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};



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
    inputCloudBtn,
    placeHolderInput,
    examplesData,
    showPraeparatSearch, // Added this prop
}) {

    const { activeFilter } = useFilter(); // Get the active filter from context, local storage to see if pro is selected or not. if not, dont show theme selector
    const [theme, setTheme] = useState('default');

    const currentTheme = chatThemes[theme];
    // Retrieve theme from localStorage on initial load
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);
    // Save theme to localStorage whenever it changes
    const handleSetTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const ref = useRef<HTMLDivElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
    const [hasAnswer, setHasAnswer] = useState(false);
    const [showFollowUpButtons, setShowFollowUpButtons] = useState(false);
    const [showInputCloud, setShowInputCloud] = useState(false);
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
        <section className={currentTheme?.section || chatThemes.default.section}>
            {/* Conditionally render ThemeSelector based on activeFilter */}
            {activeFilter === 'Pro' && (
                <ThemeSelector setTheme={handleSetTheme} currentTheme={theme} />
            )}
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

                <div className="flex flex-wrap mb-3">
                    <div className="w-full md:w-2/3 mb-3 md:mb-0">
                        <div
                            className={`h-[500px] rounded-md border overflow-auto p-4 ${currentTheme?.stripeEffect || currentTheme?.container || chatThemes.default.container
                                }`}
                            ref={ref}
                        >
                            {messages.length > 1 ? (
                                messages.map((m) => (
                                    <Message key={m.id} message={m} currentTheme={currentTheme} />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <InputCloud
                                        setInput={setInput}
                                        handlePopEffect={handlePopEffect}
                                        inputCloudBtn={inputCloudBtn}
                                        input={input}
                                    />
                                    {/* show this row if there are not options in the inputCloudBtn provided */}
                                    {(!inputCloudBtn || Object.keys(inputCloudBtn).length === 0) && (
                                        <>
                                            <p className="text-xl md:text-2xl font-bold mb-6">
                                                Bitte geben Sie Ihre Anfrage in die Zeile unten ein
                                            </p>
                                            <div className="text-6xl animate-bounce">↓</div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {showFollowUpButtons && (
                            <>
                                <FollowUpButtons
                                    setInput={setInput}
                                    handlePopEffect={handlePopEffect}
                                    followupBtn={followupBtn}
                                />

                            </>
                        )}

                    </div>

                    <SidebarPanel // sidebar panel
                        currentTheme={currentTheme}
                        showPraeparatSearch={showPraeparatSearch} // {true} //         
                        examplesData={examplesData}
                        handleLiClick={handleLiClick}
                    />

                </div>


                <div className='flex flex-wrap items-center mt-2 pb-0'>
                    <div className='w-full md:w-2/3'>
                        {/* Add InputCloud above the textarea */}


                        {/* Prompt submission from */}
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
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto'; // Reset height to calculate the correct height
                                    target.style.height = `${target.scrollHeight}px`; // Adjust height to content
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

                    <div className='w-full md:w-1/3 flex items-start pl-3 pb-5 justify-center md:justify-start md:flex'>

                        {messages.length > 1 && (
                            <div className="mt-4">
                                <DownloadButton message={messages[messages.length - 1]?.content || 'No message available'} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <FeedbackModal showModal={showSuggestionsModal} setShowModal={setShowSuggestionsModal} />
            <p className={`mt-2 text-sm ${tokenStatus.color} flex items-center`}>
                {tokenStatus.icon} <span className="ml-2">{tokenStatus.message}</span>: {tokenCount}
            </p>
            {/* Add the download button below the chat area */}

        </section>
    )
}
