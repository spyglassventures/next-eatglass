import React from 'react';

interface PictureQualityModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PictureQualityModal: React.FC<PictureQualityModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const goodExamples = [
        {
            src: '/images/dermatologie/DermaGood1.jpg',
            label: 'Übersichtsaufnahme (~30 cm)',
        },
        {
            src: '/images/dermatologie/DermaGood2.jpg',
            label: 'Nahaufnahme (~10 cm), Hautveränderung klar und detailliert',
        },
        {
            src: '/images/dermatologie/DermaGood3.jpg',
            label: 'Nahaufnahme aus anderem Winkel (~10 cm), Struktur sichtbar',
        },
    ] as const;

    const badExamples = [
        { src: '/images/dermatologie/DermaBad1.jpg', label: 'Unscharf / Verwackelt' },
        { src: '/images/dermatologie/DermaBad2.jpg', label: 'Zu dunkel' },
        { src: '/images/dermatologie/DermaBad3.jpg', label: 'Blitzlicht' },
        { src: '/images/dermatologie/DermaBad4.jpg', label: 'Zu grosser Abstand' },
        { src: '/images/dermatologie/DermaBad5.jpg', label: 'Zu nah, unscharf' },
    ] as const;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[120] p-4 pt-24">
            <div className="bg-white rounded-lg max-w-5xl w-full relative flex flex-col max-h-[90vh]">
                {/* Close Button */}
                <div className="sticky top-0 z-10 flex justify-end bg-white pt-2 pr-2">
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-black text-2xl"
                        aria-label="Schließen"
                    >
                        ×
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-center">
                        Gute und schlechte Beispielbilder
                    </h2>

                    <p className="mb-6 text-gray-700">
                        Für eine erfolgreiche teledermatologische Begutachtung müssen qualitativ hochwertige Fotos der Hautstelle hochgeladen werden.
                    </p>

                    {/* Gute Beispiele */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-2">Gute Beispiele:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            {goodExamples.map((img, idx) => (
                                <div key={idx}>
                                    <img
                                        src={img.src}
                                        alt={img.label}
                                        className="rounded shadow w-full h-36 object-cover"
                                    />
                                    <p className="text-sm mt-2">{img.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Schlechte Beispiele */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-2">Schlechte Beispiele:</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            {badExamples.map((img, idx) => (
                                <div key={idx}>
                                    <img
                                        src={img.src}
                                        alt={img.label}
                                        className="rounded shadow w-full h-36 object-cover"
                                    />
                                    <p className="text-sm mt-2">{img.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Anforderungen */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Anforderungen an die Bilddokumentation</h3>
                        <ul className="list-disc pl-6 text-gray-700">
                            <li>Mindestens 3 Fotos:</li>
                            <ul className="list-disc pl-6">
                                <li>Übersichtsaufnahme (ca. 30 cm Abstand)</li>
                                <li>Nahaufnahme (ca. 10 cm Abstand)</li>
                                <li>Nahaufnahme aus einem anderen Winkel (ca. 10 cm Abstand)</li>
                            </ul>
                        </ul>
                    </div>

                    {/* Checkliste */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Checkliste vor dem Senden</h3>
                        <ul className="list-disc pl-6 text-gray-700 space-y-1">
                            <li>Mindestens 1 Foto der betroffenen Hautstelle?</li>
                            <li>2 unterschiedliche Perspektiven fotografiert?</li>
                            <li>Tageslicht genutzt?</li>
                            <li>Hautveränderung klar fokussiert?</li>
                            <li>Keine verwackelten oder zu dunklen Bilder?</li>
                        </ul>
                    </div>

                    {/* Warnhinweis */}
                    <p className="text-red-600 font-semibold text-center mt-6">
                        Nur mit hochwertigen Fotos ist eine zuverlässige digitale Diagnose möglich!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PictureQualityModal;
