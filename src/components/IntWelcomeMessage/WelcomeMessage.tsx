import React, { useState } from 'react';
import Link from 'next/link';



interface WelcomeMessageProps {
    onDismiss: () => void;
    onComplete: () => void;
    step: number;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onDismiss, onComplete, step }) => {
    const [currentChapter, setCurrentChapter] = useState(1);
    // const [doNotShowAgain, setDoNotShowAgain] = useState(false);

    const imageBasePath = '/images/welcomeMessage/';

    const chapters = [
        {
            title: 'Willkommen bei DocDialog Starthilfe',
            content: 'Nutzen Sie die graue Navigation unterhalb um zwischen den einzelnen KI Helfern zu wechseln. Das aktive Tab ist dunkelgrau.',
            image: `${imageBasePath}w1.png`,
            className: '',
            imagePosition: 'bottom',
        },
        {
            title: 'Ausklappbare Menüs',
            content: 'In der unteren Zeile der Navigation finden Sie die ausklappbaren Menüs (Gekennzeichnet mit ⌄ und gleich sichtbar.',
            image: `${imageBasePath}w2.png`,
            className: 'rounded-lg shadow-lg',
            imagePosition: 'right',
        },
        {
            title: 'KI Abfrage abschicken',
            content: 'In der unteren Zeile kann nun eine Anfrage erfolgen. Geben Sie beispielsweise Patientensymptome ein (oder kopieren Sie diese aus dem Verlauf und drücken Sie die grüne "Enter" Taste um Ihre Anfrage zu senden.',
            image: `${imageBasePath}w3.png`,
            className: 'rounded-lg shadow-lg',
            imagePosition: 'bottom',
        },
        {
            title: 'Beispiele',
            content: 'Auf der rechten Seite finden Sie Beispiele für Anfragen, die Sie direkt in das Eingabefeld durch klicken übertragen können. Diese dienen als Inspiration für Ihre Anfragen.',
            image: `${imageBasePath}w4.png`,
            className: 'rounded-lg shadow-lg',
            imagePosition: 'right',
        },
    ];

    const handleNext = () => {
        if (currentChapter < chapters.length) {
            setCurrentChapter(currentChapter + 1);
        }
    };

    const handlePrevious = () => {
        if (currentChapter > 1) {
            setCurrentChapter(currentChapter - 1);
        }
    };

    // cookie currently not used
    const handleComplete = () => {
        // if (doNotShowAgain) {
        //     document.cookie = "hideWelcomeMessage=true; max-age=" + 365 * 24 * 60 * 60;
        // }
        onComplete();
    };

    // Determine layout based on image position for the current chapter
    const imageComponent = (
        <img
            src={chapters[currentChapter - 1].image}
            alt={`Step ${currentChapter}`}
            className={`${chapters[currentChapter - 1].className} mb-4 w-full h-auto`}
        />
    );

    const contentComponent = (
        <div className="text-gray-700 mb-4 flex-1">
            {chapters[currentChapter - 1].content}
        </div>
    );

    const renderContent = () => {
        const { imagePosition } = chapters[currentChapter - 1];
        switch (imagePosition) {
            case 'top':
                return (
                    <>
                        {imageComponent}
                        {contentComponent}
                    </>
                );
            case 'bottom':
                return (
                    <>
                        {contentComponent}
                        {imageComponent}
                    </>
                );
            case 'left':
                return (
                    <div className="flex flex-row">
                        <div className="w-1/2 mr-4">
                            {imageComponent}
                        </div>
                        <div className="w-1/2">
                            {contentComponent}
                        </div>
                    </div>
                );
            case 'right':
                return (
                    <div className="flex flex-row">
                        <div className="w-1/2">
                            {contentComponent}
                        </div>
                        <div className="w-1/2 ml-4">
                            {imageComponent}
                        </div>
                    </div>
                );
            default:
                return (
                    <>
                        {imageComponent}
                        {contentComponent}
                    </>
                );
        }
    };

    return (
        <div className="welcome-message bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{chapters[currentChapter - 1].title}</h2>
                <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
                    &times;
                </button>
            </div>
            <div className="text-sm text-gray-500 mb-2">{`Schritt ${currentChapter} von ${chapters.length}`}</div>
            {renderContent()}
            <div className="flex justify-between items-center mt-6">
                <div className="flex items-center">
                    {/* Dont show again, currently not used */}
                    {/* <input
                        type="checkbox"
                        id="doNotShowAgain"
                        checked={doNotShowAgain}
                        onChange={(e) => setDoNotShowAgain(e.target.checked)}
                        className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="doNotShowAgain" className="text-gray-600">
                        Diese Meldung nicht mehr anzeigen
                    </label> */}
                </div>
                <div className="flex items-center space-x-4">
                    {currentChapter > 1 && (
                        <button
                            onClick={handlePrevious}
                            className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Zurück
                        </button>
                    )}
                    {currentChapter < chapters.length ? (
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Weiter
                        </button>
                    ) : (
                        <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200">
                            <a href="/intern">Fertig</a>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WelcomeMessage;
