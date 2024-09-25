// src/components/AI/chat_pdf.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import CopyToClipboard from '@/components/copy-to-clipboard';
import FeedbackModal from './FeedbackModal';

const totalSteps = 21; // Adjust this according to the actual number of steps

function formatMessageContent(content) {
    return content.split('**').map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
}

export default function Chat_pdf() {
    const ref = useRef<HTMLDivElement>(null);
    const [url, setUrl] = useState('');
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(0);
    const [showLogs, setShowLogs] = useState(true);
    const [ids, setIds] = useState({ vectorStoreId: '', fileId: '' });
    const [showModal, setShowModal] = useState(false);

    const highlightKeyword = (message) => {
        return message
            .replace(/URL/g, '<span class="bg-yellow-300">URL</span>')
            .replace(/Vector store/g, '<span class="bg-blue-300">Vector store</span>')
            .replace(/File ID/g, '<span class="bg-green-300">File ID</span>')
            .replace(/Error/g, '<span class="bg-red-300">Error</span>')
            .replace(/Summary/g, '<span class="bg-purple-300">Summary</span>');
    };

    const addLog = useCallback((message, type = 'info', delay = 2000) => {
        setTimeout(() => {
            const timestamp = new Date().toLocaleTimeString();
            const formattedMessage = `<span class="${type === 'error' ? 'text-red-500' : 'text-green-500'}">${timestamp}:</span> ${highlightKeyword(message)} ${type === 'error' ? '⚠️' : '📄'}`;
            setLogs((prevLogs) => [...prevLogs, formattedMessage]);
            setStep((prevStep) => {
                const newStep = prevStep + 1;
                setProgress((newStep / totalSteps) * 100);
                return newStep;
            });
        }, delay);
    }, []);

    useEffect(() => {
        if (ref.current === null) return;
        ref.current.scrollTo(0, ref.current.scrollHeight);
    }, [logs, summary]);

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const handleShowLogsChange = (e) => {
        setShowLogs(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSummary('');
        setLogs([]);
        setProgress(0);
        setStep(0);
        setIds({ vectorStoreId: '', fileId: '' });

        addLog('Sending request to API for file upload and vector store creation...', 'info', 0);

        try {
            addLog(`Processing URL: ${url}`, 'info', 500);
            const response = await axios.post('/api/upload', { url });

            if (response.data.vectorStoreId && response.data.fileId) {
                addLog(`Vector store created with ID: ${response.data.vectorStoreId}`, 'info', 1000);
                addLog(`File ID: ${response.data.fileId}`, 'info', 1500);
                setIds({ vectorStoreId: response.data.vectorStoreId, fileId: response.data.fileId });

                if (response.data.logs && response.data.logs.length > 0) {
                    response.data.logs.forEach((log, index) => addLog(log, 'info', 2000 + index * 500));
                }

                addLog('Sending request to API for summarization...', 'info', 3000);
                const summaryResponse = await axios.post('/api/summarize', {
                    vectorStoreId: response.data.vectorStoreId,
                    fileId: response.data.fileId,
                });

                if (summaryResponse.data.summary) {
                    setSummary(summaryResponse.data.summary);
                    addLog('Summary received successfully.', 'info', 3500);
                } else {
                    addLog(summaryResponse.data.log || 'No summary received.', 'info', 3500);
                }
            }
        } catch (error) {
            console.error('Error processing URL', error);
            addLog(`Error processing URL: ${error.message}`, 'error', 4000);
        } finally {
            setIsLoading(false);
            addLog('Zusammenfassung wurde erstellt.', 'info', 4500);
        }
    };

    return (
        <section className='py-1 text-zinc-700 dark:text-zinc-300'>
            <div className='container'>
                <div className='mt-3 w-full max-w-full text-left relative -ml-4'>
                    <h1 className='font-medium pt-5 text-zinc-900 dark:text-zinc-100'>Closed-Beta Test: URL eingeben ➜ Zusammenfassung erhalten</h1>
                </div>

                <div className='flex'>
                    <div className='mt-3 w-3/4 text-left relative -ml-4'>
                        <div className='absolute top-0 right-0 -mt-10 ml-2'>
                            {/* <CopyToClipboard message={logs[logs.length - 1]} className='' /> */}
                        </div>

                        <div
                            className='mb-2 h-[500px] rounded-md border dark:border-zinc-700 overflow-auto text-left bg-white dark:bg-zinc-900'
                            ref={ref}
                        >
                            {logs.map((log, index) => (
                                <div key={index} className='mr-6 whitespace-pre-wrap md:mr-12 text-left'>
                                    <p dangerouslySetInnerHTML={{ __html: log }} />
                                </div>
                            ))}
                            {summary && (
                                <div className='mt-6 bg-gray-200 p-8 overflow-auto rounded'>
                                    <h2 className='text-xl font-semibold mb-2 text-black'>Zusammenfassung:</h2>
                                    <p className='text-black'>{summary}</p>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className='relative'>
                            <Input
                                name='url'
                                value={url}
                                onChange={handleUrlChange}
                                placeholder='Bitte PDF URL eingeben'
                                className='pr-12 placeholder:italic placeholder:text-zinc-600/75 focus-visible:ring-zinc-500 text-left dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-400'
                            />
                            <button
                                type='submit'
                                className='absolute right-1 top-1 h-8 w-20 bg-emerald-500 text-white rounded flex items-center justify-center'
                                disabled={isLoading || !url.trim()}
                            >
                                {isLoading ? 'Zusammenfassung...' : 'Submit'}
                            </button>
                        </form>

                        {isLoading && (
                            <div className='mt-6'>
                                <h2 className='text-xl font-semibold mb-2 text-black'>Fortschritt:</h2>
                                <div className='w-full bg-gray-300 rounded-full h-4 mb-4'>
                                    <div className='bg-blue-500 h-4 rounded-full' style={{ width: `${progress}%` }}></div>
                                </div>
                                <p className='text-sm text-black'>{step} von {totalSteps} Schritten abgeschlossen.</p>
                            </div>
                        )}
                    </div>

                    {/* Legend Section */}
                    <div className='mt-1 w-1/4 text-left relative pl-5'>
                        <div className='mt-2 bg-gray-100 dark:bg-gray-800 pl-13 rounded-md max-h-[500px] overflow-y-auto'>
                            <p className='p-1 font-semibold text-zinc-900 dark:text-zinc-100'>Beispiele für Eingaben:</p>
                            <ul className='p-1 mt-1 text-sm text-zinc-700 dark:text-zinc-300'>
                                <li>URL + enter</li>
                                <li>......</li>
                                <li>Tipp: Text muss markierbar sein</li>
                                <li>(keine Bilder)</li>
                                <li>URL muss mit .pdf enden.</li>
                                <li>In der Demoversion nur mit kleinen Datein möglich.</li>
                                <li>......</li>
                                <li>Dauer: max. 2 Min</li>
                            </ul>
                            {/* <p className='p-1 font-semibold text-zinc-900 dark:text-zinc-100 mt-3'>Bekannte Abkürzungen:</p>
                            <ul className='p-1 mt-1 text-sm text-zinc-700 dark:text-zinc-300'>
                                <li></li>
                                <li></li>
                            </ul> */}
                        </div>
                        <div className='mt-3'>
                            <button
                                className='h-8 max-w-full bg-gray-600 text-white rounded flex items-center justify-center pl-8 pr-8'
                                onClick={() => setShowModal(true)}
                            >
                                Was können wir besser machen?
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <FeedbackModal showModal={showModal} setShowModal={setShowModal} />
        </section>
    );
}
