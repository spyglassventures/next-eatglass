const TarmedSuche = () => (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">TARMED Übersicht</h1>
        <p className="text-gray-700 mb-4">
            Willkommen in der TARDOC Plattform. Hier können Sie TARMED-Positionen schnell suchen, auswählen und exportieren.
        </p>
        <p className="text-gray-700 mb-4">
            Wechseln Sie oben zur Transcription, um freitextliche Berichte in Ziffern zu überführen.
        </p>
        <p className="text-gray-700">
            Die externe Plattform <a href="https://tarifmatcher.oaat-otma.ch/transcode?locale=de" className="text-indigo-600 underline" target="_blank">Tarifmatcher</a> bietet zusätzliche Kodierungen.
        </p>
    </div>
);

export default TarmedSuche;
