// ChatStructure.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import CopyToClipboard from '@/components/copy-to-clipboard';
import FeedbackModal from '@/components/AI/FeedbackModal';
import Message from '@/components/AI/KI_FORMS/Message';
import SuggestionsSidebar from '@/components/AI/KI_FORMS/SuggestionsSidebar';
import { countTokens, getTokenStatus } from '@/components/AI/KI_FORMS/textUtils';
import '../styles.css';

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
    const [showRemovedWords, setShowRemovedWords] = useState(false);

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
        setShowRemovedWords(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(e);
    };

    return (
        <section className='py-1 text-zinc-700 dark:text-zinc-300'>
            <div className='p-0'>
                <div className='flex flex-wrap mb-3'>
                    <div className='w-full md:w-2/3 mb-3 md:mb-0'>
                        <div className='h-[500px] rounded-md border dark:border-zinc-700 overflow-auto bg-white dark:bg-zinc-900 p-4' ref={ref}>
                            {messages.length > 1 ? (
                                messages.map((m) => <Message key={m.id} message={m} />)
                            ) : (
                                <div className='flex flex-col items-center justify-center h-full'>
                                    <p className='text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300 mb-6'>
                                        Bitte kopieren Sie Ihren Verlauf in die untere Zeile
                                    </p>
                                    <div className='text-6xl text-gray-500 dark:text-gray-400 animate-bounce'>
                                        ↓
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='w-full md:w-1/3 pl-3 hidden md:block'>
                        <SuggestionsSidebar
                            cleanWords={cleanWords}
                            setCleanWords={setCleanWords}
                            showPasteCheck={showPasteCheck}
                            setShowPasteCheck={setShowPasteCheck}
                            handleCleanAgain={handleCleanAgain}
                            removedWords={removedWords}
                            showRemovedWords={showRemovedWords}
                        />
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
                                type='submit'
                                className='absolute right-1 top-1 h-8 w-20 bg-emerald-500 text-white rounded flex items-center justify-center'
                            >
                                Enter
                            </button>
                        </form>
                    </div>

                    <div className='w-full md:w-1/3 flex items-start pl-2 pb-2 justify-center md:justify-start'>
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
                {tokenStatus.icon} <span className='ml-2'>{tokenStatus.message}</span>: {tokenCount}
            </p>
        </section>
    );
}
