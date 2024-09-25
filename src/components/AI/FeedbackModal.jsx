// FeedbackModal.jsx
import React from 'react';
import Image from 'next/image';

function FeedbackModal({ showModal, setShowModal }) {
    if (!showModal) return null;

    const handleClose = () => setShowModal(false);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleClose}>
            <div className="bg-white dark:bg-zinc-800 p-6 rounded shadow-lg relative flex flex-col sm:flex-row w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-2 right-2 text-red-600 font-bold" onClick={handleClose}>
                    Schliessen
                </button>
                <div className="w-full sm:w-2/3 pr-0 sm:pr-4">
                    <h2 className="text-lg font-semibold mb-4">Rückmeldung zum Copilot geben</h2>
                    <ol className="list-decimal list-inside mb-4 space-y-2">
                        <li>
                            Handy nehmen. QR Code mit Kamera-App scannen.<br />
                            Gelben Link klicken, welcher WhatsApp öffnet:<br />
                            <div className="inline-flex items-center bg-amber-400 text-black rounded-full px-3 py-1 mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 7v5h3m-3 0H9m3 5v1m0 0v1m-3-6h6m-3 0V9" />
                                </svg>
                                me-qr.com
                                <button className="ml-2 text-black">×</button>
                            </div><br />
                        </li>
                        <li>
                            Im WhatsApp bitte den Fehler beschreiben, bzw.<br />
                            nennen, was Sie erwartet hätten.<br />
                        </li>
                        <li>
                            Diesen Dialog am PC wieder schließen.<br />
                        </li>
                        <li>
                            Bitte zudem ein Foto vom Bildschirm mit dem Copilot Chat machen und im gleichen Chat senden. So kann ich die Eingabe/Ausgabe besser nachvollziehen und ggf. verbessern. <br />
                        </li>
                    </ol>
                    <p className="mb-4">Besten Dank, Daniel.</p>
                </div>

                <div className="w-full sm:w-1/3 flex justify-center items-center mt-4 sm:mt-0">
                    <Image src="/images/ai/CopilotFeedback.png" alt="Feedback" width="500" height="600" className="w-3/4 h-auto" />
                </div>
            </div>
        </div>
    );
}

export default FeedbackModal;
