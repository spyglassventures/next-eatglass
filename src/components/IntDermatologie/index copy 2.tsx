import React, { useState } from 'react';
import PictureQualityModal from './PictureQualityModal';
import MedikamentSection from './MedikamentSection';

export type Symptom =
    | 'Fieber'
    | 'Bluthochdruck'
    | 'Diabetes'
    | 'Asthma'
    | 'Migräne'
    | 'andere';

const generateId = () =>
    Math.random().toString(36).substring(2, 6) +
    '-' +
    Math.random().toString(36).substring(2, 6);

/** Typsichere Button-Gruppe für String-Optionen */
const tabOptions = <T extends string>(
    options: readonly T[],
    selected: T,
    onSelect: (val: T) => void
) => (
    <div className="flex flex-wrap gap-2">
        {options.map((option) => (
            <button
                key={option}
                type="button"
                onClick={() => onSelect(option)}
                className={`px-3 py-1 rounded border ${selected === option
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border-gray-300'
                    }`}
            >
                {option}
            </button>
        ))}
    </div>
);

const Dermatologie: React.FC = () => {
    const [formData, setFormData] = useState({
        dataOption: 'form' as 'form' | 'card',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        insurance: '',
        insuranceNumber: '',
        hautproblem: '',
        dauer: '' as string,
        beginn: '' as string,
        behandlung: '' as '' | 'ja' | 'nein',
        behandlungText: '',
        vergangenheit: '' as '' | 'ja' | 'nein',
        vergangenheitText: '',
        allergien: '' as '' | 'ja' | 'nein',
        allergienText: '',
        vorerkrankungen: [] as Symptom[],
        vorerkrankungenText: '',
        weitereSymptome: 'nein' as 'ja' | 'nein', // Default to 'nein' is good
    });

    const [medikamente, setMedikamente] = useState([
        { name: '', frequenz: '', seit: '' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientId] = useState(generateId());
    const [feedback, setFeedback] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [showMedSection, setShowMedSection] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear specific error when user types
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const handleSymptomChange = (symptom: Symptom) => {
        setFormData((prev) => {
            const set = new Set(prev.vorerkrankungen);
            set.has(symptom) ? set.delete(symptom) : set.add(symptom);
            return { ...prev, vorerkrankungen: Array.from(set) };
        });
        // Clear vorerkrankungen error if a selection is made and weitereSymptome is 'ja'
        if (formData.weitereSymptome === 'ja' && errors.vorerkrankungen) {
            setErrors(prevErrors => ({ ...prevErrors, vorerkrankungen: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        // Validierung
        if (formData.dataOption === 'form') {
            if (!formData.firstName.trim())
                newErrors.firstName = 'Vorname ist Pflicht.';
            if (!formData.lastName.trim())
                newErrors.lastName = 'Nachname ist Pflicht.';
            if (!formData.dateOfBirth)
                newErrors.dateOfBirth = 'Geburtsdatum ist Pflicht.';
            if (!formData.insurance.trim())
                newErrors.insurance = 'Versicherung ist Pflicht.';
            if (!formData.insuranceNumber.trim())
                newErrors.insuranceNumber = 'Versichertennummer ist Pflicht.';
        }
        if (!formData.hautproblem.trim())
            newErrors.hautproblem = 'Bitte das Hautproblem beschreiben.';
        if (!formData.dauer) newErrors.dauer = 'Bitte eine Dauer auswählen.'; // Error if ''
        if (!formData.beginn) newErrors.beginn = 'Bitte angeben, wie es begann.'; // Error if ''

        // Frage 4: Behandlung
        if (!formData.behandlung) // Checks for initial '' state
            newErrors.behandlung = 'Bitte ja oder nein auswählen.';
        else if ( // Only validate behandlungText if 'ja' is selected
            formData.behandlung === 'ja' &&
            !formData.behandlungText.trim()
        )
            newErrors.behandlungText =
                'Bitte erläutern, welche Behandlung erfolgte.';

        // Frage 5: Vergangenheit
        if (!formData.vergangenheit)
            newErrors.vergangenheit = 'Bitte ja oder nein auswählen.';
        else if (
            formData.vergangenheit === 'ja' &&
            !formData.vergangenheitText.trim()
        )
            newErrors.vergangenheitText =
                'Bitte Vorgeschichte beschreiben.';

        // Frage 6: Weitere Vorerkrankungen
        // formData.weitereSymptome is initialized to 'nein', so !formData.weitereSymptome should not be an issue
        // unless it's somehow cleared, which tabOptions prevents.
        if (!formData.weitereSymptome) { // This should ideally not trigger due to default 'nein'
            newErrors.weitereSymptome = 'Bitte ja oder nein auswählen.';
        } else if (
            formData.weitereSymptome === 'ja' &&
            formData.vorerkrankungen.length === 0 && // Only require vorerkrankungen if 'ja'
            !formData.vorerkrankungenText.trim() // Also consider if 'andere' needs text. For now, just length.
            // If 'andere' is selected, vorerkrankungenText might be required.
            // For this fix, we primarily care about the 'ja'/'nein' logic.
        ) {
            newErrors.vorerkrankungen =
                'Bitte mindestens eine Vorerkrankung wählen oder Details angeben.';
        }


        // Frage 7: Allergien
        if (!formData.allergien)
            newErrors.allergien = 'Bitte ja oder nein auswählen.';
        else if (
            formData.allergien === 'ja' &&
            !formData.allergienText.trim() // Only validate allergienText if 'ja'
        )
            newErrors.allergienText =
                'Bitte Ihre Allergien beschreiben.';

        // Fehler gefunden?
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setFeedback('❌ Bitte füllen Sie alle Pflichtfelder korrekt aus.');
            return;
        }

        // alles OK, senden…
        setErrors({});
        setFeedback('');
        setIsSending(true);

        // Prepare data for sending: ensure medikamente is empty if behandlung is 'nein'
        const dataToSend = {
            ...formData,
            medikamente: formData.behandlung === 'ja' ? medikamente : [], // Key change for sending
            patientId,
        };


        try {
            const response = await fetch('/api/sendgrid_dermatologie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend), // Send the adjusted data
            });
            const result = await response.json();

            if (response.ok) {
                setFeedback('✅ Ihre Anfrage wurde erfolgreich übermittelt.');
                // Optionally reset form here
            } else {
                setFeedback(
                    `❌ Fehler: ${result.message || 'Bitte versuchen Sie es erneut.'}`
                );
            }
        } catch (error) {
            console.error("Sending error:", error);
            setFeedback(
                '❌ Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
            );
        } finally {
            setIsSending(false);
        }
    };

    const downloadJSON = () => {
        const dataToDownload = {
            ...formData,
            medikamente: formData.behandlung === 'ja' ? medikamente : [],
            patientId
        };
        const json = JSON.stringify(dataToDownload, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hautfragebogen-${patientId}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center py-16 px-4">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl w-full">
                <h1 className="text-center text-3xl font-semibold mb-8">
                    Vorbereitung: 3 Bilder machen, dann Online-Hautfragebogen ausfüllen
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="text-center">
                            <img
                                src={`/images/dermatologie/beispiel${i}.jpg`}
                                alt={`Beispiel ${i}`}
                                className="rounded shadow mx-auto"
                            />
                            <p className="mt-2 font-medium">
                                {['Übersichtsaufnahme', 'Nahaufnahme', 'Anderer Winkel'][i - 1]}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
                    >
                        Was ist ein gutes Bild? Beispiele ansehen
                    </button>
                </div>

                <div className="space-y-4">
                    <label className="block font-semibold mb-2">
                        Wie möchten Sie die Patientendaten übermitteln?
                    </label>
                    <div className="flex gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="dataOption"
                                value="form"
                                checked={formData.dataOption === 'form'}
                                onChange={() =>
                                    setFormData((p) => ({ ...p, dataOption: 'form' }))
                                }
                                className="mr-2"
                            />
                            Per Formular
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="dataOption"
                                value="card"
                                checked={formData.dataOption === 'card'}
                                onChange={() =>
                                    setFormData((p) => ({ ...p, dataOption: 'card' }))
                                }
                                className="mr-2"
                            />
                            Foto der Karte
                        </label>
                    </div>
                    {/* No specific error for dataOption in original code, assuming it's not strictly required before other fields */}
                </div>

                {formData.dataOption === 'form' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    name="firstName"
                                    placeholder="Vorname"
                                    className={`border p-3 rounded w-full ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                {errors.firstName && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>
                            <div>
                                <input
                                    name="lastName"
                                    placeholder="Nachname"
                                    className={`border p-3 rounded w-full ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                                {errors.lastName && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.lastName}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="dateOfBirth" className="sr-only">Geburtsdatum</label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                aria-label="Geburtsdatum"
                                className={`w-full border p-3 rounded ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                            />
                            {errors.dateOfBirth && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.dateOfBirth}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    name="insurance"
                                    placeholder="Versicherung"
                                    className={`border p-3 rounded w-full ${errors.insurance ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    value={formData.insurance}
                                    onChange={handleChange}
                                />
                                {errors.insurance && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.insurance}
                                    </p>
                                )}
                            </div>
                            <div>
                                <input
                                    name="insuranceNumber"
                                    placeholder="Versichertennummer"
                                    className={`border p-3 rounded w-full ${errors.insuranceNumber ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    value={formData.insuranceNumber}
                                    onChange={handleChange}
                                />
                                {errors.insuranceNumber && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.insuranceNumber}
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                )}

                <div>
                    <label className="block font-semibold mb-2">
                        1. Beschreiben Sie das aktuelle Hautproblem (max. 1500 Zeichen):
                    </label>
                    <textarea
                        name="hautproblem"
                        maxLength={1500}
                        placeholder="Krankheitsbeginn, Verlauf, Juckreiz..."
                        className={`w-full border p-3 rounded ${errors.hautproblem ? 'border-red-500' : 'border-gray-300'
                            }`}
                        rows={4}
                        value={formData.hautproblem}
                        onChange={handleChange}
                    />
                    {errors.hautproblem && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.hautproblem}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block font-semibold mb-2">
                        2. Seit wann besteht dieses Problem?
                    </label>
                    {tabOptions(
                        ['< 3 Tage', '3–7 Tage', '> 1 Woche', '> 1 Monat', '> 1 Jahr'] as const,
                        formData.dauer,
                        (v) => {
                            setFormData((p) => ({ ...p, dauer: v }));
                            if (errors.dauer) setErrors(prev => ({ ...prev, dauer: '' }));
                        }
                    )}
                    {errors.dauer && (
                        <p className="text-red-600 text-sm mt-1">{errors.dauer}</p>
                    )}
                </div>

                <div>
                    <label className="block font-semibold mb-2">
                        3. Wie hat das Problem begonnen?
                    </label>
                    {tabOptions(
                        ['plötzlich', 'langsam', 'weiß ich nicht'] as const,
                        formData.beginn,
                        (v) => {
                            setFormData((p) => ({ ...p, beginn: v }));
                            if (errors.beginn) setErrors(prev => ({ ...prev, beginn: '' }));
                        }
                    )}
                    {errors.beginn && (
                        <p className="text-red-600 text-sm mt-1">{errors.beginn}</p>
                    )}
                </div>

                {/* Frage 4 */}
                <div>
                    <label className="block font-semibold mb-2">
                        4. Wurde bereits eine Behandlung durchgeführt?
                    </label>
                    {tabOptions(['ja', 'nein'] as const, formData.behandlung, (v) => {
                        setFormData((p) => ({ ...p, behandlung: v, ...(v === 'nein' && { behandlungText: '' }) })); // Clear text if 'nein'
                        if (v === 'nein') {
                            setShowMedSection(false);
                            // Medikamente will be handled at submission (set to [] if behandlung is 'nein')
                            // Or, if you want to clear it from state immediately:
                            // setMedikamente([{ name: '', frequenz: '', seit: '' }]); // or []
                        }
                        if (errors.behandlung) setErrors(prev => ({ ...prev, behandlung: '' }));
                        if (errors.behandlungText && v === 'nein') setErrors(prev => ({ ...prev, behandlungText: '' }));
                    })}
                    {errors.behandlung && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.behandlung}
                        </p>
                    )}

                    {formData.behandlung === 'ja' && (
                        <>
                            <textarea
                                name="behandlungText"
                                placeholder="Welche Behandlung?"
                                className={`w-full border p-3 rounded mt-2 ${errors.behandlungText ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                rows={3}
                                value={formData.behandlungText}
                                onChange={handleChange}
                            />
                            {errors.behandlungText && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.behandlungText}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => {
                                    // Ensure medikamente has an initial item if empty and showing section
                                    if (!showMedSection && medikamente.length === 0) {
                                        setMedikamente([{ name: '', frequenz: '', seit: '' }]);
                                    }
                                    setShowMedSection((s) => !s);
                                }}
                                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            >
                                {showMedSection
                                    ? 'Medikament verbergen'
                                    : 'Medikament hinzufügen'}
                            </button>

                            {showMedSection && (
                                <div className="mt-4">
                                    <MedikamentSection
                                        medikamente={medikamente}
                                        setMedikamente={setMedikamente}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Frage 5 */}
                <div>
                    <label className="block font-semibold mb-2">
                        5. Bestehen Hautveränderungen in der Vergangenheit?
                    </label>
                    {tabOptions(['ja', 'nein'] as const, formData.vergangenheit, (v) => {
                        setFormData((p) => ({ ...p, vergangenheit: v, ...(v === 'nein' && { vergangenheitText: '' }) }));
                        if (errors.vergangenheit) setErrors(prev => ({ ...prev, vergangenheit: '' }));
                        if (errors.vergangenheitText && v === 'nein') setErrors(prev => ({ ...prev, vergangenheitText: '' }));
                    })}

                    {errors.vergangenheit && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.vergangenheit}
                        </p>
                    )}
                    {formData.vergangenheit === 'ja' && (
                        <>
                            <textarea
                                name="vergangenheitText"
                                placeholder="z. B. Ekzem, damals behandelt…"
                                className={`w-full border p-3 rounded mt-2 text-gray-700 placeholder-gray-400 ${errors.vergangenheitText ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                rows={3}
                                value={formData.vergangenheitText}
                                onChange={handleChange}
                            />
                            {errors.vergangenheitText && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.vergangenheitText}
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Frage 6 */}
                <div>
                    <label className="block font-semibold mb-2">
                        6. Weitere Vorerkrankungen?
                    </label>
                    {tabOptions(['ja', 'nein'] as const, formData.weitereSymptome, (v) => {
                        setFormData((p) => ({
                            ...p,
                            weitereSymptome: v,
                            ...(v === 'nein'
                                ? { vorerkrankungen: [], vorerkrankungenText: '' }
                                : {}),
                        }));
                        if (errors.weitereSymptome) setErrors(prev => ({ ...prev, weitereSymptome: '' }));
                        if (errors.vorerkrankungen && v === 'nein') setErrors(prev => ({ ...prev, vorerkrankungen: '' }));
                    })}
                    {errors.weitereSymptome && ( // This error message might be redundant if default is 'nein'
                        <p className="text-red-600 text-sm mt-1">
                            {errors.weitereSymptome}
                        </p>
                    )}

                    {formData.weitereSymptome === 'ja' && (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                                {(
                                    ['Fieber', 'Bluthochdruck', 'Diabetes', 'Asthma', 'Migräne', 'andere'] as Symptom[]
                                ).map((symptom) => (
                                    <label key={symptom} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={formData.vorerkrankungen.includes(symptom)}
                                            onChange={() => handleSymptomChange(symptom)}
                                        />
                                        {symptom}
                                    </label>
                                ))}
                            </div>
                            {errors.vorerkrankungen && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.vorerkrankungen}
                                </p>
                            )}
                            <textarea
                                name="vorerkrankungenText"
                                placeholder="Weitere Angaben zu Vorerkrankungen (falls 'andere' oder zur Erläuterung)"
                                className={`w-full border p-3 rounded mt-2 ${errors.vorerkrankungenText ? 'border-red-500' : 'border-gray-300'}`}
                                rows={3}
                                value={formData.vorerkrankungenText}
                                onChange={handleChange}
                            />
                            {/* You might add errors.vorerkrankungenText if it becomes mandatory */}
                        </>
                    )}
                </div>

                {/* Frage 7 */}
                <div>
                    <label className="block font-semibold mb-2">
                        7. Sind Allergien bekannt?
                    </label>
                    {tabOptions(['ja', 'nein'] as const, formData.allergien, (v) => {
                        setFormData((p) => ({ ...p, allergien: v, ...(v === 'nein' && { allergienText: '' }) }));
                        if (errors.allergien) setErrors(prev => ({ ...prev, allergien: '' }));
                        if (errors.allergienText && v === 'nein') setErrors(prev => ({ ...prev, allergienText: '' }));
                    })}
                    {errors.allergien && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.allergien}
                        </p>
                    )}
                    {formData.allergien === 'ja' && (
                        <>
                            <textarea
                                name="allergienText"
                                placeholder="Bitte Ihre Allergien beschreiben"
                                className={`w-full border p-3 rounded mt-2 ${errors.allergienText ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                rows={3}
                                value={formData.allergienText}
                                onChange={handleChange}
                            />
                            {errors.allergienText && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.allergienText}
                                </p>
                            )}
                        </>
                    )}
                </div>

                <div>
                    <label className="block font-semibold mb-2">
                        8. Fotos an <b>spyglass@hin.ch</b> mailen
                    </label>
                    <p className="text-sm text-gray-600">
                        Betreff: Hautproblem-ID{' '}
                        <span className="font-mono bg-gray-200 px-1 rounded">{patientId}</span>
                    </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-yellow-900">
                    <p>
                        <strong>Hinweis:</strong> Falls in Abwesenheit, kann TARMED-Ziff. 00.0145
                        verrechnet werden.
                    </p>
                </div>
                <div className="bg-gray-100 border border-gray-200 p-4 rounded text-sm space-y-2">
                    <p>
                        Mir ist bekannt, dass es sich um eine Selbstzahlerleistung handeln
                        kann und die Kosten gemäss TARMED-Ansatz (digitale Konsultation) CHF 60 betragen.
                    </p>
                    <p>Ich akzeptiere die Nutzungsbedingungen der Derma2go AG.</p>
                    <p>
                        Ich verzichte auf vorherige Aufklärung über Risiken und Alternativen.
                    </p>
                </div>

                <div className="text-center space-x-4">
                    <button
                        type="submit"
                        disabled={isSending}
                        className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition disabled:opacity-50"
                    >
                        {isSending ? 'Wird gesendet…' : 'Anfrage absenden'}
                    </button>
                    <button
                        type="button"
                        onClick={downloadJSON}
                        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
                    >
                        Als JSON speichern
                    </button>
                </div>

                {feedback && (
                    <div
                        className={`mt-4 p-3 rounded text-sm ${feedback.startsWith('✅')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {feedback}
                    </div>
                )}
            </form>

            <PictureQualityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Dermatologie;