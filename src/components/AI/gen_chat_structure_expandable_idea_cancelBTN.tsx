'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import CopyToClipboard from '@/components/copy-to-clipboard'
import FeedbackModal from './FeedbackModal'
import PraeparatSearchForm from '../PraeparatSearchForm'
import { FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaChevronDown, FaChevronRight, FaParagraph, FaLayerGroup } from 'react-icons/fa' // Add more icons
import './styles.css'; // Import the styles

// Hiding of theme selector
import { useFilter } from '@/components/AI/FilterContext'; // Import the useFilter hook
import chatThemes from './chatThemes';
import ThemeSelector from './ThemeSelector';
import DownloadButton from './ai_utils/DownloadButton'; // Import the new DownloadButton component

import SidebarPanel from './ai_utils/sidebarPanel';
import FollowUpButtons from './ai_utils/FollowUpButtons'
import InputCloud from './ai_utils/InputCloud'


// Component to handle expandable sections
const ExpandableSection = ({ title, children, defaultExpanded }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="mb-2 border-b pb-2">
            <div
                className="flex items-center cursor-pointer"
                onClick={toggleExpand}
            >
                {isExpanded ? (
                    <FaChevronDown className="mr-2" />
                ) : (
                    <FaChevronRight className="mr-2" />
                )}
                <strong>{title}</strong>
            </div>
            {isExpanded && <div className="pl-1 mt-1">{children}</div>}
        </div>
    );
};

// Enhanced function to format the message content
const FormatMessageContent = ({ content }) => {
    // Remove all '$' from the content first
    const cleanContent = content.replace(/\$/g, '');

    // Match sections for headers like `**N. Chaptername:**` or `N. **Chaptername:**`
    const sections = cleanContent.split(/(\*\*[1-9]\.\s.*?\*\*|[1-9]\.\s\*\*.*?\*\*)/g);

    return sections.map((section, index) => {
        const trimmedSection = section.trim();

        // Header sections (odd indices matching the regex)
        if (index % 2 === 1) {
            // Extract the title by removing unnecessary `**` and leading numbers
            const title = trimmedSection
                .replace(/^\*\*|\*\*$/g, '') // Remove surrounding `**`
                .replace(/^[1-9]\.\s/, ''); // Remove leading number and period

            return (
                <ExpandableSection
                    key={index}
                    title={title}
                    defaultExpanded={Math.floor(index / 2) === 2} // Expand the 3rd section
                >
                    {sections[index + 1]?.trim()}
                </ExpandableSection>
            );
        }

        // Plain text sections (at even indices)
        if (trimmedSection) {
            // If this even section directly follows a header (odd index), skip it
            if ((index - 1) % 2 === 1) {
                return null;
            }

            // Otherwise, render as plain text
            return <p key={index}>{trimmedSection}</p>;
        }

        return null; // Skip empty sections
    });
};



// Function to retain bold rendering in raw view
const RawMessageContent = ({ content }) => {
    const sections = content.split(/(\*\*.*?\*\*)/g); // Match bold sections

    return sections.map((section, index) => {
        if (/\*\*(.*?)\*\*/.test(section)) {
            // Render bold text
            return <strong key={index}>{section.replace(/\*\*/g, '')}</strong>;
        }
        return <span key={index}>{section}</span>;
    });
};




// Styling of chat between user and copilot
const Message = ({ message, currentTheme, isStreaming, stopRequest, setStopRequest }) => {
    const [showFormatted, setShowFormatted] = useState(false);
    const [messageContent, setMessageContent] = useState(message.content);

    const userMessageClass = `${currentTheme?.messageUser || chatThemes.default.messageUser} p-3 rounded-md`;
    const assistantMessageClass = `${currentTheme?.messageAssistant || chatThemes.default.messageAssistant} p-3 rounded-md`;
    // const buttonClass = `${currentTheme?.button || chatThemes.default.button} mt-2 px-2 py-1 rounded border hover:bg-opacity-90`;
    const buttonClass = `${currentTheme?.button || chatThemes.default.button} mt-2 px-2 py-1 rounded border hover:bg-opacity-90 flex items-center gap-2`;

    const toggleView = () => {
        setShowFormatted(!showFormatted);
    };

    const stopRequestRef = useRef(false); // Use a ref to track stopRequest

    useEffect(() => {
        if (!isStreaming) return;

        const streamInterval = setInterval(() => {
            // Stop streaming if requested
            if (stopRequestRef.current) {
                clearInterval(streamInterval);
                return;
            }

            // Append new content incrementally
            setMessageContent((prevContent) => {
                const nextChunk = message.content.slice(prevContent.length, prevContent.length + 10);
                if (!nextChunk) {
                    clearInterval(streamInterval); // Stop when all content is streamed
                    return prevContent; // No more content to append
                }
                return prevContent + nextChunk;
            });
        }, 100); // Append content every 100ms

        return () => clearInterval(streamInterval); // Cleanup
    }, [isStreaming, message.content]);



    useEffect(() => {
        // Simulate API content update
        const timeout = setTimeout(() => {
            setMessageContent(message.content); // Assume message.content comes from API
        }, 2000); // Simulated delay

        return () => clearTimeout(timeout);
    }, [message.content]);

    return (
        <div key={message.id} className="mr-6 whitespace-pre-wrap md:mr-2 p-2">
            {message.role === 'user' && (
                <div className="flex gap-3 relative right-0 justify-end">
                    <div
                        className={`${userMessageClass} ${currentTheme?.fontSize || chatThemes.default.fontSize} ${currentTheme?.fontWeight || chatThemes.default.fontWeight}`}
                    >
                        <p className="font-semibold">Ihre Eingabe:</p>
                        <div className="mt-1.5">
                            <RawMessageContent content={messageContent} />
                        </div>
                    </div>
                </div>
            )}
            {message.role === 'assistant' && (
                <div className="flex gap-3">
                    <div
                        className={`${assistantMessageClass} ${currentTheme?.fontSize || chatThemes.default.fontSize} ${currentTheme?.fontWeight || chatThemes.default.fontWeight}`}
                    >
                        <div className="flex justify-between">
                            <p className="font-semibold">Copilot</p>
                        </div>
                        <div className="mt-2">
                            {showFormatted ? (
                                <FormatMessageContent content={messageContent} />
                            ) : (
                                <RawMessageContent content={messageContent} />
                            )}
                        </div>
                        <button
                            className={`${buttonClass}`}
                            onClick={toggleView}
                        >
                            {showFormatted ? (
                                <>
                                    <FaParagraph className="mr-1" /> Darstellung als Fliesstext
                                </>
                            ) : (
                                <>
                                    <FaLayerGroup className="mr-1" /> zu Hauptkapitel aggregieren
                                </>
                            )}
                        </button>
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
    const [isStreaming, setIsStreaming] = useState(false);

    const stopRequestRef = useRef(false); // Use a ref to track stopRequest
    const [stopRequest, setStopRequest] = useState(false); // Stop request state for streaming
    const [dynamicPlaceholder, setDynamicPlaceholder] = useState(placeHolderInput);

    useEffect(() => {
        // Update the placeholder state if the external prop changes
        setDynamicPlaceholder(placeHolderInput);
    }, [placeHolderInput]);



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

    // Stop streaming handler
    const handleStopStreaming = () => {
        setIsStreaming(false); // Stop streaming state
        console.log('Streaming... StopRequest:', stopRequestRef.current);
        stopRequestRef.current = true; // Set the stop request ref
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

            {/* Stop Button */}
            {!isStreaming && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleStopStreaming}
                        className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
                    >
                        Stop
                    </button>
                </div>
            )}


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
                                    <Message
                                        key={m.id}
                                        message={m}
                                        currentTheme={currentTheme}
                                        isStreaming={isStreaming}
                                        stopRequest={stopRequest} // Pass stopRequest
                                        // stopRequestRef={stopRequestRef}
                                        setStopRequest={setStopRequest} // Pass setter to reset
                                    />
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
                    <div className="w-full md:w-2/3">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit(e);

                                // Update the placeholder when the form is submitted
                                setDynamicPlaceholder("Sie können nun Folgefragen stellen, den Inhalt diskutieren oder eine neue Anfrage eingeben");

                                // Reset the textarea
                                const textarea = e.currentTarget.querySelector("textarea") as HTMLTextAreaElement;
                                if (textarea) {
                                    textarea.style.height = "auto";
                                    textarea.value = ""; // Clear the input
                                }
                            }}
                            className="relative"
                        >
                            <textarea
                                name="message"
                                value={input}
                                onChange={handleInputChange}
                                placeholder={dynamicPlaceholder} // Use the dynamic placeholder state
                                className="w-full pl-1 pt-2 pb-3 pr-24 placeholder:italic border placeholder:text-zinc-600/75 focus-visible:ring-zinc-500 text-left dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-400 rounded-md resize-none overflow-y-auto"
                                rows={1}
                                style={{
                                    minHeight: "36px", // Initial height for one row
                                    maxHeight: "300px", // Maximum height
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(new CustomEvent("submit") as unknown as React.FormEvent<HTMLFormElement>);
                                        const textarea = e.target as HTMLTextAreaElement;
                                        textarea.style.height = "40px"; // Reset height to initial state
                                        textarea.value = ""; // Clear input value

                                        // Update the placeholder
                                        setDynamicPlaceholder("Weitere Folgefragen möglich oder den Text exportieren, siehe rechte Seite (z.B. in Word)");
                                    }
                                }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = "auto"; // Reset height to calculate the correct height
                                    target.style.height = `${Math.min(target.scrollHeight, 300)}px`; // Adjust height to content, up to max-height
                                }}
                            />

                            <button
                                type="submit"
                                className={`absolute bottom-3 right-6 h-8 w-20 bg-emerald-500 text-white rounded flex items-center justify-center button-pop ${isPopped ? "popped" : ""}`}
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
