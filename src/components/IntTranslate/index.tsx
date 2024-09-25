import React, { useState } from 'react';
import axios from 'axios';

// Import flag images or use a library for real flags
// import { FlagIcon } from 'react-flagkit';

const IntTranslate: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [targetLang, setTargetLang] = useState<string>('EN-US'); // Default to English
    const [translatedText, setTranslatedText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [darkMode, setDarkMode] = useState<boolean>(false); // Example state for dark mode

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    const handleLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTargetLang(event.target.value);
    };

    const translateText = async () => {
        if (text.trim() === '') return;
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/api/translate', {
                text: text,
                targetLang: targetLang,
            });
            setTranslatedText(response.data.translatedText);
        } catch (error) {
            setError('Fehler bei der Übersetzung. Bitte versuchen Sie es erneut.');
        } finally {
            setLoading(false);
        }
    };

    const buttonStyle = `px-6 py-3 rounded-lg transition-colors duration-300 ease-in-out ${loading ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
        }`;

    const dropdownStyle = `w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`;

    return (
        <div className={`container mx-auto  ${darkMode ? ' text-white' : ' text-gray-900'}`}>
            <div className={`p-5 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 p-4 flex flex-col">
                        <h1 className="text-3xl font-bold mb-4 text-gray-900">DeepL Übersetzer</h1>
                        <textarea
                            rows={6}
                            value={text}
                            onChange={handleTextChange}
                            placeholder="Geben Sie den zu übersetzenden Text ein..."
                            className={`w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                        />
                        <div className="flex flex-col md:flex-row md:items-center mt-4 space-y-4 md:space-y-0 md:space-x-4">
                            <select
                                value={targetLang}
                                onChange={handleLangChange}
                                className={dropdownStyle}
                            >
                                <option value="EN-US">🇺🇸 In Englisch übersetzen</option>
                                <option value="FR">🇫🇷 In Französisch übersetzen</option>
                                <option value="DE">🇩🇪 In Deutsch übersetzen</option>
                                <option value="IT">🇮🇹 In Italienisch übersetzen</option>
                                <option value="NL">🇳🇱 In Niederländisch übersetzen</option>
                                <option value="PL">🇵🇱 In Polnisch übersetzen</option>
                                <option value="PT-PT">🇵🇹 In Portugiesisch übersetzen</option>
                                <option value="ES">🇪🇸 In Spanisch übersetzen</option>
                                <option value="RU">🇷🇺 In Russisch übersetzen</option>
                                {/* Weitere Sprachoptionen nach Bedarf hinzufügen */}
                            </select>
                            <button
                                onClick={translateText}
                                className={buttonStyle}
                                disabled={loading}
                            >
                                {loading ? 'Bitte warten...' : 'Los'}
                            </button>
                        </div>
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                    </div>
                    <div className="md:w-1/2 p-4">
                        <h2 className="text-xl font-semibold mb-2 text-gray-900">Übersetzung:</h2>
                        <p className={`whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{translatedText}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntTranslate;
