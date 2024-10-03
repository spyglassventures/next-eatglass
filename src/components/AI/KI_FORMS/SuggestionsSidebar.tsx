import React, { useEffect, useState } from 'react';
import { FaFileWord } from 'react-icons/fa';

const SuggestionsSidebar = ({
    cleanWords,
    setCleanWords,
    showPasteCheck,
    setShowPasteCheck,
    handleCleanAgain,
    removedWords,
    showRemovedWords,
}) => {
    const [wordFiles, setWordFiles] = useState([]);

    // Fetch the list of Word files
    useEffect(() => {
        const fetchWordFiles = async () => {
            try {
                const response = await fetch('/forms/wordFiles.json');
                const files = await response.json();
                setWordFiles(files);
            } catch (error) {
                console.error('Error fetching word files:', error);
            }
        };

        fetchWordFiles();
    }, []);

    return (
        <div className='bg-gray-100 dark:bg-gray-800 rounded-md max-h-[500px] overflow-y-auto p-2 text-sm'>
            <p className='font-semibold text-zinc-900 dark:text-zinc-100 mb-4'>Ablauf für beste Zeitersparnis:</p>
            <ul className='list-disc pl-4 space-y-1 text-zinc-700 dark:text-zinc-300'>
                <li>Wählen Sie das passende Formular unter &quot;KI Formulare&quot;.</li>
                <li>Exportieren Sie den Verlauf aus dem Praxisprogramm (F5, Zeitraum auswählen), markieren und kopieren.</li>
                <li>Fügen Sie den Verlauf in das Eingabefeld unten links ein.</li>
                <li>Entfernen Sie den Patientennamen mit den Filteroptionen (Name, Vorname), dann &quot;Eingabe bereinigen&quot; klicken.</li>
                <li>Eingabe ist bereinigt. Nun mit Enter absenden.</li>
                <li>KI generiert nun den Formulartext. Klicken Sie auf &quot;Formular anzeigen und aktualisieren&quot;, Text ergänzen/korrigieren und &quot;Übertragen in Word&quot;.</li>
            </ul>

            <p className='font-semibold text-zinc-900 dark:text-zinc-100 mt-5 mb-1'>Filteroptionen:</p>
            <label className='flex items-center space-x-1 mb-1'>
                <input
                    type='checkbox'
                    className='form-checkbox'
                    checked={showPasteCheck}
                    onChange={() => setShowPasteCheck(!showPasteCheck)}
                />
                <span className='text-xs'>Text-Bereinigung aktivieren</span>
            </label>
            <div className='mt-1'>
                <p className='text-xs'>Zu entfernende Wörter (kommagetrennt):</p>
                <input
                    type='text'
                    value={cleanWords}
                    onChange={(e) => setCleanWords(e.target.value)}
                    className='w-full mt-1 p-1 rounded-md dark:bg-zinc-800 dark:text-zinc-300'
                    placeholder='Wörter eingeben...z.B. Max, Muster'
                />
            </div>
            <button onClick={handleCleanAgain} className='mt-2 bg-emerald-500 text-white rounded px-3 py-1 text-xs'>
                Eingabe bereinigen
            </button>

            {showRemovedWords && (
                <div className='mt-2'>
                    <p className='font-semibold text-xs'>Entfernte Wörter:</p>
                    <ul className='list-disc pl-4 text-xs'>
                        {removedWords.map((wordData, index) => (
                            <li key={index}>
                                {wordData.word} - {wordData.count} mal entfernt
                            </li>
                        ))}
                    </ul>
                    <p className='text-xs mt-2'>Sie können den Text nun mit Enter zur KI schicken.</p>
                </div>
            )}



            <p className='font-semibold text-zinc-900 dark:text-zinc-100 mt-5 mb-1'>Anleitung als PDF (öffnet in neuem Fenster):</p>
            <a
                href='https://drive.google.com/file/d/1OpXO2yF2CWD5GCea3BmZt-gQ2Tb63kht/view?usp=sharing'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500'
            >
                Hier klicken, um die Anleitung zu öffnen
            </a>


            <p className='font-semibold text-zinc-900 dark:text-zinc-100 mt-5 mb-1'>Verfügbare Formulare:</p>
            <div className='flex flex-wrap text-zinc-700 dark:text-zinc-300 text-xs'>
                {wordFiles.map((file: string, index) => {
                    // Remove underscores and the .docx extension
                    const formattedName = file.replace(/_/g, ' ').replace('.docx', '');

                    return (
                        <a
                            key={index}
                            href={`/forms/${file}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center mr-4 mb-1 text-blue-500'
                        >
                            <FaFileWord className='mr-1' /> {formattedName}
                        </a>
                    );
                })}
            </div>




        </div>
    );
};

export default SuggestionsSidebar;
