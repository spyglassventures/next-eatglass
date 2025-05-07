import React, { useState } from 'react';
import {
    PictureQualityModal,
    PatientDataSection,
    HautproblemSection,
    TreatmentSection,
    PastHistorySection,
    SymptomsSection,
    AllergiesSection,
    PhotoSection,
    SubmitButtons,
} from './';
import { generateId } from './utils';

export default function Dermatologie() {
    // --- State ---
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
        vorerkrankungen: [] as string[],
        vorerkrankungenText: '',
        weitereSymptome: 'nein' as 'ja' | 'nein',
    });
    const [medikamente, setMedikamente] = useState([{ name: '', frequenz: '', seit: '' }]);
    const [showMedSection, setShowMedSection] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [feedback, setFeedback] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const patientId = generateId();

    // --- Handlers ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(f => ({ ...f, [name]: value }));
    };

    const handleSymptomChange = (symptom: string) => {
        setFormData(f => {
            const set = new Set(f.vorerkrankungen);
            set.has(symptom) ? set.delete(symptom) : set.add(symptom);
            return { ...f, vorerkrankungen: Array.from(set) };
        });
    };

    const validate = () => {
        const errs: Record<string, string> = {};

        if (formData.dataOption === 'form') {
            if (!formData.firstName.trim()) errs.firstName = 'Vorname ist Pflicht.';
            if (!formData.lastName.trim()) errs.lastName = 'Nachname ist Pflicht.';
            if (!formData.dateOfBirth) errs.dateOfBirth = 'Geburtsdatum ist Pflicht.';
            if (!formData.insurance.trim()) errs.insurance = 'Versicherung ist Pflicht.';
            if (!formData.insuranceNumber.trim()) errs.insuranceNumber = 'Versichertennr. ist Pflicht.';
        }

        if (!formData.hautproblem.trim()) errs.hautproblem = 'Bitte Hautproblem beschreiben.';
        if (!formData.dauer) errs.dauer = 'Bitte Dauer auswählen.';
        if (!formData.beginn) errs.beginn = 'Bitte Beginn auswählen.';
        if (!formData.behandlung) errs.behandlung = 'Bitte ja oder nein wählen.';
        if (formData.behandlung === 'ja' && !formData.behandlungText.trim())
            errs.behandlungText = 'Bitte Behandlungsdetails eingeben.';

        if (!formData.vergangenheit) errs.vergangenheit = 'Bitte ja oder nein wählen.';
        if (formData.vergangenheit === 'ja' && !formData.vergangenheitText.trim())
            errs.vergangenheitText = 'Bitte Vorgeschichte beschreiben.';

        if (!formData.weitereSymptome) errs.weitereSymptome = 'Bitte ja oder nein wählen.';
        if (
            formData.weitereSymptome === 'ja' &&
            formData.vorerkrankungen.length === 0
        ) errs.vorerkrankungen = 'Bitte mindestens eine wählen.';

        if (!formData.allergien) errs.allergien = 'Bitte ja oder nein wählen.';
        if (formData.allergien === 'ja' && !formData.allergienText.trim())
            errs.allergienText = 'Bitte Allergien beschreiben.';

        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            setFeedback('❌ Bitte alle Pflichtfelder ausfüllen.');
            return;
        }

        setErrors({});
        setFeedback('');
        setIsSending(true);

        try {
            const res = await fetch('/api/sendgrid_dermatologie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, medikamente, patientId }),
            });
            const json = await res.json();

            if (res.ok) {
                setFeedback('✅ Anfrage erfolgreich übermittelt.');
            } else {
                setFeedback(`❌ Fehler: ${json.message || 'Bitte nochmal versuchen.'}`);
            }
        } catch {
            setFeedback('❌ Netzwerkfehler. Bitte später erneut.');
        } finally {
            setIsSending(false);
        }
    };

    const downloadJSON = () => {
        const data = JSON.stringify({ ...formData, medikamente, patientId }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hautfragebogen-${patientId}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // --- Render ---
    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-4">
            <PatientDataSection
                dataOption={formData.dataOption}
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onOptionChange={opt => setFormData(f => ({ ...f, dataOption: opt }))}
            />

            <HautproblemSection
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onSelect={(key, val) =>
                    setFormData(f => ({ ...f, [key]: val }))
                }
            />

            <TreatmentSection
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onSelect={(k, v) => setFormData(f => ({ ...f, [k]: v }))}
                showMed={showMedSection}
                toggleMed={() => setShowMedSection(s => !s)}
                medikamente={medikamente}
                setMedikamente={setMedikamente}
            />

            <PastHistorySection
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onSelect={(k, v) => setFormData(f => ({ ...f, [k]: v }))}
            />

            <SymptomsSection
                formData={formData}
                errors={errors}
                onCheckbox={handleSymptomChange}
                onSelect={(k, v) => setFormData(f => ({ ...f, [k]: v }))}
                onChange={handleChange}
            />

            <AllergiesSection
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onSelect={(k, v) => setFormData(f => ({ ...f, [k]: v }))}
            />

            <PhotoSection patientId={patientId} />

            <SubmitButtons
                isSending={isSending}
                onSubmit={handleSubmit}
                onDownload={downloadJSON}
            />

            <PictureQualityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </form>
    );
}
