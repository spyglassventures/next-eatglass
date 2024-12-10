'use client';

import { ChangeEvent, useState, useRef, useEffect, FormEvent, useCallback } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import FeedbackModal from './FeedbackModal';
import { useChat } from 'ai/react';
import sidebarExamples from '@/config/ai/sidebar_examples/image_sidebar_config.json';
import CopyToClipboard from '@/components/copy-to-clipboard';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export default function ImageAnalysisBot() {
    const ref = useRef<HTMLDivElement>(null);
    const [image, setImage] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('Hier die Frage zum Bild eingeben oder aus dem Beispielen rechts wählen.');
    const [openAIResponse, setOpenAIResponse] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
    const [fileName, setFileName] = useState<string>(''); // Added state for file name

    const { messages, handleInputChange, handleSubmit } = useChat({
        initialMessages: [],
    });

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTo(0, ref.current.scrollHeight);
        }
    }, [openAIResponse]);

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (!files || files.length === 0) {
            window.alert('Keine Datei ausgewählt. Bitte Bilddatei (png, jpg, jpeg) auswählen.');
            setFileName(''); // Reset fileName if no file is selected
            return;
        }

        const file = files[0];
        if (!file.type.match('image.*')) {
            window.alert('Ungültige Datei. Bitte Bilddatei (png, jpg, jpeg) auswählen.');
            setFileName(''); // Reset fileName if file is not valid
            return;
        }

        setFileName(file.name); // Set the file name in state

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setImage(reader.result);
            }
        };

        reader.onerror = (error) => {
            console.error('Fehler beim Lesen der Datei: ', error);
        };
    }

    async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (image === '') {
            alert('Bitte ein Bild hochladen.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image, prompt }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Netzwerkantwort war nicht ok: ${response.statusText}, ${errorText}`);
            }

            const result = await response.json();
            const content = result.choices?.[0]?.message?.content || 'Keine Antwort erhalten.';
            setOpenAIResponse(content);
        } catch (error) {
            console.error('Fehler beim Absenden des Formulars: ', error);
        } finally {
            setLoading(false);
        }
    }

    const handleExampleClick = useCallback((example: string) => {
        setPrompt(example);
    }, []);

    const handleImageClick = useCallback(async (imagePath: string) => {
        try {
            const response = await fetch(imagePath);
            const blob = await response.blob();
            const reader = new FileReader();

            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setImage(reader.result);
                }
            };
        } catch (error) {
            console.error('Fehler beim Laden des Bildes: ', error);
        }
    }, []);

    const assistantMessage: Message = {
        id: 'response-1',
        role: 'assistant',
        content: openAIResponse,
    };

    return (
        <section className='text-zinc-700 dark:text-zinc-300'>
            <div className=''>
                <div className='flex items-center justify-between'>
                    <h1 className='font-medium pt-5 pl-1 text-zinc-900 dark:text-zinc-100'>
                        Bild wählen und Frage zum Bild eingeben. Mit Enter abschicken. Funktioniert nur mit kleinen Dateien (weniger 200 KB)
                    </h1>
                    {openAIResponse && (
                        <div className='pt-5'>
                            <CopyToClipboard message={assistantMessage} />
                        </div>
                    )}
                </div>

                <div className='flex mt-3'>
                    <div className='w-2/3 text-left relative'>
                        <div
                            className='h-[500px] rounded-md border dark:border-zinc-700 overflow-auto bg-white dark:bg-zinc-900 p-4'
                            ref={ref}
                        >
                            <h2 className='text-xl font-bold mb-4'>Vorschau:</h2>
                            {image ? (
                                <div className='mb-4 overflow-hidden'>
                                    <Image src={image} width={500} height={300} className='w-full object-contain max-h-72' alt='Hochgeladenes Bild' />
                                </div>
                            ) : (
                                <div className='mb-4 p-8 text-center'>
                                    <p>Bild wird hier angezeigt werden</p>
                                </div>
                            )}

                            {loading && (
                                <div className='flex items-center justify-center mb-4'>
                                    <svg
                                        className='animate-spin h-5 w-5 mr-3 text-zinc-700 dark:text-zinc-300'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                    >
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'
                                        ></circle>
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8v8H4z'
                                        ></path>
                                    </svg>
                                    <p>Das Bild wird analysiert...</p>
                                </div>
                            )}

                            {openAIResponse && (
                                <div className='border-t border-gray-300 pt-4'>
                                    <h2 className='text-xl font-bold mb-2'>Doc Dialog Antwort:</h2>
                                    <p>{openAIResponse}</p>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleFormSubmit} className='relative flex items-center space-x-2'>
                            <div className='w-1/6 flex flex-col'>
                                <label htmlFor='image' className='sr-only'>Bild hochladen</label>
                                <div className='relative pt-2'>
                                    <input
                                        id='image'
                                        name='image'
                                        type='file'
                                        onChange={handleFileChange}
                                        className='hidden' // Hide the actual input
                                        accept='image/png, image/jpeg'
                                    />
                                    <label
                                        htmlFor='image'
                                        className='mb-2 w-full h-10 text-center text-sm text-white bg-emerald-500 rounded cursor-pointer flex items-center justify-center hover:bg-emerald-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
                                    >
                                        {fileName || 'Datei hochladen'}
                                    </label>
                                </div>


                            </div>
                            <div className='flex-grow'>
                                <label htmlFor='prompt' className='sr-only'>Frage eingeben</label>
                                <Input
                                    id='prompt'
                                    name='prompt'
                                    type='text'
                                    value={prompt}
                                    onFocus={() => setPrompt('')} // Clears placeholder on focus
                                    onBlur={() => prompt === '' && setPrompt('Hier die Frage zum Bild eingeben oder aus dem Beispielen rechts wählen.')} // Restores placeholder if input is empty
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder='Frage eingeben'
                                    className='mb-2 h-10 pr-0 w-full placeholder:italic placeholder:text-zinc-600/75 focus-visible:ring-zinc-500 text-left dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-400'
                                />
                            </div>
                            <button
                                type='submit'
                                className='h-10 w-32 bg-emerald-500 text-white rounded flex items-center justify-center'
                            >
                                Enter
                            </button>
                        </form>
                    </div>

                    <div className='w-1/3 text-left relative pl-3'>
                        <div className='bg-gray-100 dark:bg-gray-800 p-4 rounded-md max-h-[500px] overflow-y-auto'>
                            <p className='font-semibold text-zinc-900 dark:text-zinc-100 mb-2'>
                                Beispiele (klickbar):
                            </p>
                            <ul className='text-sm text-zinc-700 dark:text-zinc-300'>
                                {sidebarExamples.examples.map((example, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleExampleClick(example)}
                                        className='cursor-pointer border border-gray-300 dark:border-gray-600 rounded-md p-2 mb-2'
                                    >
                                        {example}
                                    </li>
                                ))}
                            </ul>
                            <p className='font-semibold text-zinc-900 dark:text-zinc-100 mb-2 mt-4'>
                                Bilder (klickbar):
                            </p>
                            <ul className='text-sm text-zinc-700 dark:text-zinc-300 grid grid-cols-2 gap-2'>
                                {sidebarExamples.imagePaths.map((imagePath, index) => (
                                    <li key={index} onClick={() => handleImageClick(imagePath)} className='cursor-pointer'>
                                        <Image
                                            src={imagePath}
                                            alt={`Sidebar Bild ${index + 1}`}
                                            width={100}
                                            height={100}
                                            className='border border-gray-300 dark:border-gray-600 rounded-md object-contain'
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='pt-2'>
                            <button
                                className='h-10 w-full bg-gray-600 text-white rounded flex items-center justify-center'
                                onClick={() => setShowSuggestionsModal(true)} // Show the feedback modal
                            >
                                Feedback
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <FeedbackModal showModal={showSuggestionsModal} setShowModal={setShowSuggestionsModal} />
        </section>
    );
}
