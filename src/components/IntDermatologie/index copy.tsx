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
        weitereSymptome: 'nein' as 'ja' | 'nein',
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
    };

    const handleSymptomChange = (symptom: Symptom) => {
        setFormData((prev) => {
            const set = new Set(prev.vorerkrankungen);
            set.has(symptom) ? set.delete(symptom) : set.add(symptom);
            return { ...prev, vorerkrankungen: Array.from(set) };
        });
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
        if (!formData.dauer) newErrors.dauer = 'Bitte eine Dauer auswählen.';
        if (!formData.beginn) newErrors.beginn = 'Bitte angeben, wie es begann.';
        if (!formData.behandlung)
            newErrors.behandlung = 'Bitte ja oder nein auswählen.';
        if (
            formData.behandlung === 'ja' &&
            !formData.behandlungText.trim()
        )
            newErrors.behandlungText =
                'Bitte erläutern, welche Behandlung erfolgte.';

        if (!formData.vergangenheit)
            newErrors.vergangenheit = 'Bitte ja oder nein auswählen.';
        if (
            formData.vergangenheit === 'ja' &&
            !formData.vergangenheitText.trim()
        )
            newErrors.vergangenheitText =
                'Bitte Vorgeschichte beschreiben.';

        if (!formData.weitereSymptome)
            newErrors.weitereSymptome = 'Bitte ja oder nein auswählen.';
        if (
            formData.weitereSymptome === 'ja' &&
            formData.vorerkrankungen.length === 0
        )
            newErrors.vorerkrankungen =
                'Bitte mindestens eine Vorerkrankung wählen.';

        if (!formData.allergien)
            newErrors.allergien = 'Bitte ja oder nein auswählen.';
        if (
            formData.allergien === 'ja' &&
            !formData.allergienText.trim()
        )
            newErrors.allergienText =
                'Bitte Ihre Allergien beschreiben.';

        // Fehler gefunden?
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setFeedback('❌ Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }

        // alles OK, senden…
        setErrors({});
        setFeedback('');
        setIsSending(true);

        try {
            const response = await fetch('/api/sendgrid_dermatologie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, medikamente, patientId }),
            });
            const result = await response.json();

            if (response.ok) {
                setFeedback('✅ Ihre Anfrage wurde erfolgreich übermittelt.');
            } else {
                setFeedback(
                    `❌ Fehler: ${result.message || 'Bitte versuchen Sie es erneut.'}`
                );
            }
        } catch {
            setFeedback(
                '❌ Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
            );
        } finally {
            setIsSending(false);
        }
    };

    const downloadJSON = () => {
        const json = JSON.stringify({ ...formData, medikamente, patientId }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hautfragebogen-${patientId}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center py-16 px-4">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl w-full">
                <h1 className="text-center text-3xl font-semibold mb-8">
                    Vorbereitung: 3 Bilder machen, dann Online-Hautfragebogen ausfüllen
                </h1>

                {/* Beispielbilder */}
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

                {/* Modal-Button */}
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
                    >
                        Was ist ein gutes Bild? Beispiele ansehen
                    </button>
                </div>

                {/* Daten-Optionen */}
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
                    {errors.dataOption && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.dataOption}
                        </p>
                    )}
                </div>

                {/* Formularfelder, nur wenn dataOption==='form' */}
                {formData.dataOption === 'form' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    name="firstName"
                                    placeholder="Vorname"
                                    className={`border p-3 rounded w-full ${errors.firstName ? 'border-red-500' : ''
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
                                    className={`border p-3 rounded w-full ${errors.lastName ? 'border-red-500' : ''
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
                            <input
                                type="date"
                                name="dateOfBirth"
                                className={`w-full border p-3 rounded ${errors.dateOfBirth ? 'border-red-500' : ''
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
                                    className={`border p-3 rounded w-full ${errors.insurance ? 'border-red-500' : ''
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
                                    className={`border p-3 rounded w-full ${errors.insuranceNumber ? 'border-red-500' : ''
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

                {/* Frage 1 */}
                <div>
                    <label className="block font-semibold mb-2">
                        1. Beschreiben Sie das aktuelle Hautproblem (max. 1500 Zeichen):
                    </label>
                    <textarea
                        name="hautproblem"
                        maxLength={1500}
                        placeholder="Krankheitsbeginn, Verlauf, Juckreiz..."
                        className={`w-full border p-3 rounded ${errors.hautproblem ? 'border-red-500' : ''
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

                {/* Frage 2 */}
                <div>
                    <label className="block font-semibold mb-2">
                        2. Seit wann besteht dieses Problem?
                    </label>
                    {tabOptions(
                        ['< 3 Tage', '3–7 Tage', '> 1 Woche', '> 1 Monat', '> 1 Jahr'] as const,
                        formData.dauer,
                        (v) => setFormData((p) => ({ ...p, dauer: v }))
                    )}
                    {errors.dauer && (
                        <p className="text-red-600 text-sm mt-1">{errors.dauer}</p>
                    )}
                </div>

                {/* Frage 3 */}
                <div>
                    <label className="block font-semibold mb-2">
                        3. Wie hat das Problem begonnen?
                    </label>
                    {tabOptions(
                        ['plötzlich', 'langsam', 'weiß ich nicht'] as const,
                        formData.beginn,
                        (v) => setFormData((p) => ({ ...p, beginn: v }))
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
                        setFormData((p) => ({ ...p, behandlung: v }));
                        if (v === 'nein') setShowMedSection(false);
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
                                className={`w-full border p-3 rounded mt-2 ${errors.behandlungText ? 'border-red-500' : ''
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
                                onClick={() => setShowMedSection((s) => !s)}
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
                    {tabOptions(['ja', 'nein'] as const, formData.vergangenheit, (v) =>
                        setFormData((p) => ({ ...p, vergangenheit: v }))
                    )}
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
                                className={`w-full border p-3 rounded mt-2 text-gray-600 placeholder-gray-400 ${errors.vergangenheitText ? 'border-red-500' : ''
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
                    {tabOptions(['ja', 'nein'] as const, formData.weitereSymptome, (v) =>
                        setFormData((p) => ({
                            ...p,
                            weitereSymptome: v,
                            ...(v === 'nein'
                                ? { vorerkrankungen: [], vorerkrankungenText: '' }
                                : {}),
                        }))
                    )}
                    {errors.weitereSymptome && (
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
                                placeholder="Weitere Angaben…"
                                className="w-full border p-3 rounded mt-2"
                                rows={3}
                                value={formData.vorerkrankungenText}
                                onChange={handleChange}
                            />
                        </>
                    )}
                </div>

                {/* Frage 7 */}
                <div>
                    <label className="block font-semibold mb-2">
                        7. Sind Allergien bekannt?
                    </label>
                    {tabOptions(['ja', 'nein'] as const, formData.allergien, (v) =>
                        setFormData((p) => ({ ...p, allergien: v }))
                    )}
                    {errors.allergien && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.allergien}
                        </p>
                    )}
                    {formData.allergien === 'ja' && (
                        <>
                            <textarea
                                name="allergienText"
                                className={`w-full border p-3 rounded mt-2 ${errors.allergienText ? 'border-red-500' : ''
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

                {/* Frage 8 */}
                <div>
                    <label className="block font-semibold mb-2">
                        8. Fotos an <b>spyglass@hin.ch</b> mailen
                    </label>
                    <p className="text-sm text-gray-600">
                        Betreff: Hautproblem-ID{' '}
                        <span className="font-mono">{patientId}</span>
                    </p>
                </div>

                {/* Hinweise & AGB etc. */}
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-yellow-900">
                    <p>
                        <strong>Hinweis:</strong> Falls in Abwesenheit, kann TARMED-Ziff. 00.0145
                        verrechnet werden.
                    </p>
                </div>
                <div className="bg-gray-100 border p-4 rounded text-sm space-y-2">
                    <p>
                        Mir ist bekannt, dass es sich um eine Selbstzahlerleistung handeln
                        kann…
                    </p>
                    <p>Ich akzeptiere die Nutzungsbedingungen der Derma2go AG.</p>
                    <p>
                        Ich verzichte auf vorherige Aufklärung über Risiken und Alternativen.
                    </p>
                </div>

                {/* Aktionen */}
                <div className="text-center space-x-4">
                    <button
                        type="submit"
                        disabled={isSending}
                        className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
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

                {/* Feedback */}
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
