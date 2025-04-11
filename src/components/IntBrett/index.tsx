// pages/brett.tsx
import React, { useState } from 'react';
import cirsConfig from '../../config/cirsConfig.json';


const initialCIRSEntry = {
    praxis_id: 100,
    fachgebiet: '',
    ereignis_ort: '',
    ereignis_tag: '',
    versorgungsart: '',
    asa_klassifizierung: '',
    patientenzustand: '',
    begleitumstaende: '',
    medizinprodukt_beteiligt: '',
    fallbeschreibung: '',
    positiv: '',
    negativ: '',
    take_home_message: '',
    haeufigkeit: '',
    berichtet_von: '',
    berufserfahrung: '',
    bemerkungen: ''
};



const fieldMetadata: Record<string, { label: string; description?: string }> = {
    fachgebiet: { label: 'Zuständiges Fachgebiet' },
    ereignisOrt: { label: 'Ort des Ereignisses' },
    ereignisTag: { label: 'Tag des Ereignisses' },
    versorgungsart: { label: 'Versorgungsart' },
    asaKlassifizierung: {
        label: 'ASA-Klassifizierung',
        description: 'Vor dem Ereignis gemäss Anästhesie-Risikoklassifikation'
    },
    patientenzustand: { label: 'Patientenzustand', description: 'Nur wenn relevant oder besonders' },
    begleitumstaende: { label: 'Wichtige Begleitumstände' },
    medizinproduktBeteiligt: { label: 'War ein Medizinprodukt beteiligt?' },
    fallbeschreibung: { label: 'Fallbeschreibung', description: 'Was, warum, Verlauf, Maßnahmen etc.' },
    positiv: { label: 'Was war besonders gut?' },
    negativ: { label: 'Was war besonders ungünstig?' },
    takeHomeMessage: { label: 'Take-home-Message', description: 'Was kann man daraus lernen?' },
    haeufigkeit: { label: 'Häufigkeit solcher Ereignisse' },
    berichtetVon: { label: 'Wer berichtet?' },
    berufserfahrung: { label: 'Berufserfahrung' },
    bemerkungen: { label: 'Bemerkungen zum Berichtssystem' }
};


const Brett = () => {
    const [entry, setEntry] = useState(initialCIRSEntry);
    const [feedback, setFeedback] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEntry((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setFeedback('⏳ Speichern...');
        try {
            const res = await fetch('/api/cirs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Fehler');
            setFeedback('✅ Fall gespeichert!');
            setEntry(initialCIRSEntry);
        } catch (err: any) {
            setFeedback(`❌ Fehler: ${err.message}`);
        }
    };

    const renderField = (key: string) => {
        if (key === 'praxis_id') {
            // Nicht anzeigen, aber mitsenden
            return (
                <input
                    key={key}
                    type="hidden"
                    name="praxisId"
                    value={entry.praxis_id}
                    readOnly
                />
            );
        }
        const options = cirsConfig.dropdownOptions[key];
        const meta = fieldMetadata[key] || { label: key };


        return (
            <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
                <div>
                    <label className="block font-semibold mb-1">{meta.label}</label>
                    {meta.description && <p className="text-sm text-gray-500">{meta.description}</p>}
                </div>

                <div className="md:col-span-2">
                    {Array.isArray(options) ? (
                        options.length <= 6 ? (
                            <div className="flex flex-wrap gap-4">
                                {options.map((opt) => (
                                    <label key={opt} className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name={key}
                                            value={opt}
                                            checked={entry[key] === opt}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <select name={key} value={entry[key]} onChange={handleChange} className="w-full p-2 border rounded">
                                <option value="">Bitte auswählen</option>
                                {options.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        )
                    ) : (
                        <textarea
                            name={key}
                            value={entry[key]}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            rows={3}
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">CIRS-Fall erfassen</h1>
            <div className="bg-white p-6 shadow rounded space-y-4">
                {Object.keys(initialCIRSEntry).map(renderField)}
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Fall senden
                    </button>
                </div>
                {feedback && <p className="text-sm mt-2 text-center">{feedback}</p>}
            </div>
        </div>
    );
};

export default Brett;
