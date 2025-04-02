// components/TardocOverview.tsx
import React from 'react';
import Image from 'next/image';

interface TardocOverviewProps {
    onContinue: () => void;
}




  
const TardocOverview: React.FC<TardocOverviewProps> = ({ onContinue }) => {

    const steps = [
        {
            title: "Erster Schritt: Leistung erfassen",
            image: "/images/tardoc/TardDocSchritt1.png",
            text: "Nutzen Sie die Schnellerfassung oder geben Sie die TARMED-Rechnungspositionen einzeln ein (CAVE: Keine Validierung). Gehen Sie dazu auf den Reiter '2. TARMED erfassen', oben rechts.",
        },
        {
            title: "Zweiter Schritt: Rechnung kontrollieren und Export",
            image: "/images/tardoc/TardDocSchritt2.png",
            text: "Wenn Sie mit den Rechnungspositionen zufrieden sind, klicken Sie auf 'Exportieren'. Merken Sie sich, wo die Datei abgelegt wurde (z. B. Desktop oder Download-Ordner). Die Datei heisst z. B. tarmed_volumes.csv.",
        },
        {
            title: "Dritter Schritt: Wechsel zu tarifmatcher.oaat-otma.ch",
            image: "/images/tardoc/TardDocSchritt3.png",
            text: "Nun müssen Sie in einem neuen Fenster auf eine andere Webseite und dort die im Schritt 2 heruntergeladene Datei hochladen. Klicken Sie auf der OTMA-Webseite auf \"Chose file\" und wählen Sie die Datei aus. Dann klicken Sie auf \"Transcodieren und Download\". Die Datei namens z. B. tarmed_volumes.transcoded.csv wird heruntergeladen. Wechseln Sie nun zurück zu Doc Dialog.",
        },
        {
            title: "Vierter Schritt:  Wechsel zu Auswertung",
            image: "/images/tardoc/TardDocSchritt4.png",
            text: "In Doc Dialog – TARDOC (wo Sie gestartet sind), wählen Sie nun den Reiter '4. Auswertung'. Hier bitte die von der externen Webseite erstellte Datei (z. B. tarmed_volumes.transcoded.csv) hochladen.",
        },
        {
            title: "Einzelpositionen und Word-Export",
            image: "/images/tardoc/TardDocSchritt5.png",
            text: "Sie sehen nun, wie die einzelnen TARMED-Positionen im TARDOC übersetzt wurden. Diese Übersicht kann zudem auch als Word-Datei exportiert werden.",
        },
        {
            title: "Vergleich interpretieren",
            image: "/images/tardoc/TardDocSchritt6.png",
            text: "Alle TARMED-Positionen und TARDOC-Positionen werden nun aufaddiert und miteinander verglichen. Ausgehend davon, dass keine weiteren Positionen zusätzlich abgerechnet werden, sehen Sie nun, ob der TARDOC in dieser Rechnungssituation umsatzsteigernd oder -mindernd wirkt.",
        },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">TARMED zu TARDOC – Schritt-für-Schritt</h1>

            <p className="text-gray-700 mb-8">
                Mit diesem Programm können Sie eine TARMED-Rechnung erfassen und anschließend mit dem TARDOC vergleichen.
                Die Auswertung zeigt Ihnen, ob sich bei dieser Rechnungssituation ein Plus oder Minus ergibt. Labor und Röntgen nicht berücksichtigt (keine Änderung).
            </p>

            <div className="grid grid-cols-1 gap-10">
                {steps.map((step, index) => (
                    <div key={index} className="shadow-md rounded-xl overflow-hidden border border-gray-200">
                        <div className="bg-gray-100 px-4 py-3 font-semibold text-gray-800 text-lg">
                            {step.title}
                        </div>
                        <Image
                            src={step.image}
                            alt={step.title}
                            width={1000}
                            height={600}
                            className="w-full h-auto"
                            unoptimized
                        />
                        <div className="p-4 text-gray-700">{step.text}</div>
                    </div>
                ))}
            </div>

            <div className="mt-10 text-sm text-gray-600">
                <p className="mb-2 italic">Alle Angaben ohne Gewähr.</p>
                <p className="mb-4">
                    Bei Fragen, schreiben Sie mir doch gerne an{" "}
                    <a href="mailto:dm@spyglassventures.ch" className="text-blue-600 underline">
                        dm@spyglassventures.ch
                    </a>
                </p>

                <p className="font-medium mb-2">Bereit?</p>
                <p className="mb-2">Erfassen Sie nun die gewünschten Positionen im nächsten Schritt:</p>
                <button
                    onClick={onContinue}
                    className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    → 2. TARMED erfassen
                </button>
            </div>
        </div>
    );
};

export default TardocOverview;

