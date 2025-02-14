'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import CopyToClipboard from '@/components/copy-to-clipboard'
import FeedbackModal from './FeedbackModal'
import PraeparatSearchForm from '../PraeparatSearchForm'
import { FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa'
import './styles.css'

// Hiding of theme selector
import { useFilter } from '@/components/AI/FilterContext'
import chatThemes from './chatThemes'
import ThemeSelector from './ThemeSelector'
import DownloadButton from './ai_utils/DownloadButton'

import SidebarPanel from './ai_utils/sidebarPanel'
import FollowUpButtons from './ai_utils/FollowUpButtons'
import InputCloud from './ai_utils/InputCloud'

// Helper function to format the message content
const FormatMessageContent = ({ content }) => {
    const linkRegex = /<a href="([^"]+)" target="_blank" rel="noopener noreferrer">\[(\d+)\]<\/a>/g
    const parts = content.split(linkRegex)
    return parts.map((part, index) => {
        if (index % 3 === 1) {
            const url = part
            const label = parts[index + 1]
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
            )
        } else if (index % 3 === 2) {
            return null
        }
        return <span key={index}>{part}</span>
    })
}

// Message component (styling remains unchanged)
const Message = ({ message, currentTheme }) => {
    const userMessageClass = `${currentTheme?.messageUser || chatThemes.default.messageUser} p-3 rounded-md`
    const assistantMessageClass = `${currentTheme?.messageAssistant || chatThemes.default.messageAssistant} p-3 rounded-md`

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
    )
}

// Token counter function
const countTokens = (text) => {
    return text.split(/\s+/).filter(Boolean).length
}

// Function to determine token status
const getTokenStatus = (tokens) => {
    if (tokens > 5000) {
        return { color: 'text-red-600', message: 'Zu viele Wörter', icon: <FaTimesCircle className="text-red-600" /> }
    } else if (tokens > 3500) {
        return { color: 'text-orange-300', message: 'Eventuell zu viele Wörter', icon: <FaExclamationTriangle className="text-orange-500" /> }
    } else {
        return { color: 'text-green-600', message: 'Eingabe gut', icon: <FaCheckCircle className="text-green-600" /> }
    }
}

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
    showPraeparatSearch,
}) {
    const { activeFilter } = useFilter()
    const [theme, setTheme] = useState('default')
    const currentTheme = chatThemes[theme]

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [])

    const handleSetTheme = (newTheme) => {
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    const ref = useRef(null)
    const [showModal, setShowModal] = useState(false)
    const [showSuggestionsModal, setShowSuggestionsModal] = useState(false)
    const [hasAnswer, setHasAnswer] = useState(false)
    const [showFollowUpButtons, setShowFollowUpButtons] = useState(false)
    const [showInputCloud, setShowInputCloud] = useState(false)
    const [isPopped, setIsPopped] = useState(false)

    // Local state for the two quadratic inputs (used only before an answer is received)
    const [inputPart1, setInputPart1] = useState('')
    const [inputPart2, setInputPart2] = useState('')

    // For token count, use the combined quadratic input until an answer is received
    const combinedInput = `${inputPart1.trim()} ${inputPart2.trim()}`.trim()
    const tokenCount = countTokens(hasAnswer ? input : combinedInput)
    const tokenStatus = getTokenStatus(tokenCount)

    // Once an assistant message is received, update state so the UI changes
    useEffect(() => {
        if (messages.length > 1 && messages[messages.length - 1].role === 'assistant') {
            setHasAnswer(true)
            const timer = setTimeout(() => {
                setShowFollowUpButtons(true)
                const hideTimer = setTimeout(() => {
                    setShowFollowUpButtons(false)
                }, 12000)
                return () => clearTimeout(hideTimer)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [messages])

    // Automatically adjust textarea height
    const handleTextareaInput = (e) => {
        const target = e.currentTarget
        target.style.height = 'auto'
        target.style.height = `${target.scrollHeight}px`
    }

    // Submit function for quadratic inputs (before API response)
    // Submit function for quadratic inputs (before API response)
    // Submit function for quadratic inputs (before API response)
    const onSubmitQuadratic = (e) => {
        e.preventDefault();
        // const combined = `${inputPart1.trim()} ${inputPart2.trim()}`.trim();
        const combined = `${inputPart1.trim()} ----- Es folgt nun der Text, der die Antworten zu den obigen Fragen enthält: ----- ${inputPart2.trim()}`.trim();
        if (!combined) return;
        // Optionally update the UI (parent's state) if needed:
        setInput(combined);
        // Call handleSubmit with the combined message directly.
        handleSubmit(e, combined);
        setInputPart1('');
        setInputPart2('');
    };




    // Helper to handle Enter key in quadratic textareas.
    const handleQuadraticKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            e.stopPropagation()
            onSubmitQuadratic(e)
        }
    }

    // Submit function for the single input (after API response)
    const onSubmitSingle = (e) => {
        e.preventDefault()
        handleSubmit(e)
    }

    // Example list item click handler (same as before)
    const handleLiClick = useCallback(
        (text) => {
            setInput(text)
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop
            const offset = 280

            window.scrollTo({
                top: currentScroll + offset,
                behavior: 'smooth'
            })

            setTimeout(() => {
                setIsPopped(true)
                setTimeout(() => setIsPopped(false), 300)
            }, 800)
        },
        [setInput]
    )

    // Pop effect for follow-up buttons
    const handlePopEffect = useCallback(() => {
        setTimeout(() => {
            setIsPopped(true)
            setTimeout(() => setIsPopped(false), 300)
        }, 400)
    }, [])

    return (
        <section className={currentTheme?.section || chatThemes.default.section}>
            {activeFilter === 'Pro' && (
                <ThemeSelector setTheme={handleSetTheme} currentTheme={theme} />
            )}
            <div className="p-0">
                <div className="flex flex-wrap items-center mb-3">
                    <div className="w-full md:w-2/3">
                        <h1 className="font-medium text-zinc-900 dark:text-zinc-100 mb-2"></h1>
                        <p className="text-m text-zinc-600 dark:text-zinc-400">{warningMessage}</p>
                    </div>
                    <div className="w-full md:w-1/3 pl-3">
                        {hasAnswer && (
                            <div className="flex justify-left items-center p-0">
                                <CopyToClipboard message={messages[messages.length - 1]} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap mb-3">
                    <div className="w-full md:w-2/3 mb-3 md:mb-0">
                        {/* Chat container height changes depending on whether an answer has been received */}
                        <div
                            className={`rounded-md border overflow-auto p-4 ${currentTheme?.stripeEffect || currentTheme?.container || chatThemes.default.container
                                } ${hasAnswer ? 'h-[500px]' : 'h-[170px]'}`}
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
                                    {(!inputCloudBtn || Object.keys(inputCloudBtn).length === 0) && (
                                        <>
                                            <p className="text-xl md:text-2xl font-bold mb-6">
                                                Bitte füllen Sie die unteren 2 Boxen aus.
                                            </p>
                                            <p className="text-xl md:text-2xl font-bold mb-6">
                                                Dann mit Enter abschicken zur Texterstellung.
                                            </p>
                                            <div className="text-6xl animate-bounce">↓</div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {showFollowUpButtons && (
                            <FollowUpButtons
                                setInput={setInput}
                                handlePopEffect={handlePopEffect}
                                followupBtn={followupBtn}
                            />
                        )}
                    </div>

                    <SidebarPanel
                        currentTheme={currentTheme}
                        showPraeparatSearch={showPraeparatSearch}
                        examplesData={examplesData}
                        handleLiClick={handleLiClick}
                    />
                </div>

                <div className="flex flex-wrap items-center mt-2 pb-0">
                    <div className="w-full md:w-2/3">
                        {/* Render the input form conditionally based on whether an answer has been received */}
                        {!hasAnswer ? (
                            // Two quadratic input forms (initial state)
                            <form onSubmit={onSubmitQuadratic} className="relative">
                                <div className="flex gap-2">
                                    <textarea
                                        name="messagePart1"
                                        value={inputPart1}
                                        onChange={(e) => setInputPart1(e.target.value)}
                                        onInput={handleTextareaInput}
                                        onKeyDown={handleQuadraticKeyDown}
                                        placeholder="Anfrage/E-Mail/Referenz inkl. allen Fragen hier reinkopieren"
                                        className="w-1/2 p-2 font-light text-sm placeholder:italic border placeholder:text-zinc-600/75 focus-visible:ring-zinc-500 text-left dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-400 rounded-md resize-none aspect-square"
                                        rows={3}
                                    />
                                    <textarea
                                        name="messagePart2"
                                        value={inputPart2}
                                        onChange={(e) => setInputPart2(e.target.value)}
                                        onInput={handleTextareaInput}
                                        onKeyDown={handleQuadraticKeyDown}
                                        placeholder="Relevante KG Auszüge hier reinkopieren, unformatierter Verlauf, mehrere Einträge möglich, ohne Patientenname"
                                        className="w-1/2 p-2 font-light text-sm placeholder:italic border placeholder:text-zinc-600/75 focus-visible:ring-zinc-500 text-left dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-400 rounded-md resize-none aspect-square"
                                        rows={3}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={`absolute right-1 top-1 h-8 w-20 bg-emerald-500 text-white rounded flex items-center justify-center button-pop ${isPopped ? 'popped' : ''}`}
                                >
                                    Enter
                                </button>
                            </form>
                        ) : (
                            // Original one-line input form (after an answer is received)
                            <form onSubmit={onSubmitSingle} className="relative">
                                <textarea
                                    name="message"
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder={placeHolderInput}
                                    className="w-full p-2 placeholder:italic border placeholder:text-zinc-600/75 focus-visible:ring-zinc-500 text-left dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-400 rounded-md resize-none"
                                    rows={1}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            onSubmitSingle(e)
                                        }
                                    }}
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement
                                        target.style.height = 'auto'
                                        target.style.height = `${target.scrollHeight}px`
                                    }}
                                />
                                <button
                                    type="submit"
                                    className={`absolute right-1 top-1 h-8 w-20 bg-emerald-500 text-white rounded flex items-center justify-center button-pop ${isPopped ? 'popped' : ''}`}
                                >
                                    Enter
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="w-full md:w-1/3 flex items-start pl-3 pb-5 justify-center md:justify-start md:flex">
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
        </section>
    )
}
