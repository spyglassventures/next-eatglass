import React from 'react';

const videoData = [
    { title: 'Einloggen und Kostengutsprache', url: 'https://www.youtube.com/embed/x2adIhJ7kAE' },
    { title: 'Zurückweisungen, Übersetzungen', url: 'https://www.youtube.com/embed/oGDl1WRx0RE' },
    { title: 'Bild Analyse Fränzi', url: 'https://www.youtube.com/embed/HKYOhHY3N7E' },
    { title: 'Bild Analyse Teil 1', url: 'https://www.youtube.com/embed/oiAWt6LjULI' },
    { title: 'Bild Analyse Teil 2', url: 'https://www.youtube.com/embed/55UgfZEbUA8' },
    { title: 'KI Formulare', url: 'https://www.youtube.com/embed/RVEK_PS1T88' },
    { title: 'Interne Dokumente', url: 'https://www.youtube.com/embed/amaraWe0bT0' },


];

const LernvideosPage = () => {
    return (
        <div className="lernvideos-page-container p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Lernvideos & Anleitungen</h1>
            <p className="text-lg mb-6">Hier finden Sie eine Sammlung von hilfreichen Videos und Dokumenten, um Ihnen bei verschiedenen Themen weiterzuhelfen.</p>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Video Playlist</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videoData.map((video, index) => (
                        <div key={index} className="video-item bg-gray-200 p-4 rounded-lg shadow-sm">
                            <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                            <iframe
                                width="100%"
                                height="200"
                                src={video.url}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">PDF-Anleitungen</h2>
                <p className="mb-4">Sie können das folgende PDF-Dokument ansehen oder herunterladen:</p>
                <iframe
                    src="https://drive.google.com/file/d/1OpXO2yF2CWD5GCea3BmZt-gQ2Tb63kht/preview"
                    width="100%"
                    height="600"
                    allow="autoplay"
                    className="mb-4"
                ></iframe>
                <a
                    href="https://drive.google.com/file/d/1OpXO2yF2CWD5GCea3BmZt-gQ2Tb63kht/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    Anleitung KI Formulare Herunterladen
                </a>
            </div>
        </div>
    );
};

export default LernvideosPage;
