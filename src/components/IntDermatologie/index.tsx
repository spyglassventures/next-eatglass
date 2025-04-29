import React, { useState } from 'react';
import PictureQualityModal from './PictureQualityModal';


const generateId = () => {
    return Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 6);
};





const Dermatologie = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        insurance: '',
        insuranceNumber: '',
        hautproblem: '',
        dauer: '',
        behandlung: '',
        beginn: '',
        behandlungText: '',
        vergangenheit: '',
        vergangenheitText: '',
        allergien: '',
        allergienText: '',
        vorerkrankungen: '',
        vorerkrankungenText: '',
    });

    const [medikamente, setMedikamente] = useState([
        { name: '', frequenz: '', seit: '' },
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const [isModalOpen, setIsModalOpen] = useState(false);



    const handleMedikamentChange = (index, field, value) => {
        const updated = [...medikamente];
        updated[index][field] = value;
        setMedikamente(updated);
    };

    const addMedikament = () => {
        setMedikamente([...medikamente, { name: '', frequenz: '', seit: '' }]);
    };


    const generateId = () => {
        return Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 6);
    };

    const [patientId] = useState(generateId());





    const [feedback, setFeedback] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // ✅ this is correct
        setIsSending(true);
        setFeedback('');

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
                setFeedback(`❌ Fehler: ${result.message || 'Bitte versuchen Sie es erneut.'}`);
            }
        } catch (error) {
            console.error('❌ Fehler beim Absenden:', error);
            setFeedback('❌ Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
        }

        setIsSending(false);
    };



    const downloadJSON = () => {
        const json = JSON.stringify({ ...formData, medikamente, patientId }, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `hautfragebogen-${patientId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center py-16 px-4">
            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="max-w-4xl w-full space-y-12">
                    <h1 className="text-center text-3xl font-semibold">Vorbereitung: 3 Bilder machen, dann Online-Hautfragebogen ausfüllen</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="text-center">
                            <img src="/images/dermatologie/beispiel1.jpg" alt="Übersichtsaufnahme" className="rounded shadow mx-auto" />
                            <p className="mt-2 font-medium">Übersichtsaufnahme</p>
                        </div>
                        <div className="text-center">
                            <img src="/images/dermatologie/beispiel2.jpg" alt="Nahaufnahme" className="rounded shadow mx-auto" />
                            <p className="mt-2 font-medium">Nahaufnahme</p>
                        </div>
                        <div className="text-center">
                            <img src="/images/dermatologie/beispiel3.jpg" alt="Nahaufnahme anderer Winkel" className="rounded shadow mx-auto" />
                            <p className="mt-2 font-medium">Nahaufnahme anderer Winkel</p>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
                        >
                            Was ist ein gutes Bild? Beispiele ansehen
                        </button>
                    </div>


                    <div>
                        <label className="block font-semibold mb-1">Vorname</label>
                        <input name="firstName" className="w-full border p-3 rounded" value={formData.firstName} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Nachname</label>
                        <input name="lastName" className="w-full border p-3 rounded" value={formData.lastName} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Geburtsdatum</label>
                        <input type="date" name="dateOfBirth" className="w-full border p-3 rounded" value={formData.dateOfBirth} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Versicherung</label>
                        <input name="insurance" className="w-full border p-3 rounded" value={formData.insurance} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Versichertennummer</label>
                        <input name="insuranceNumber" className="w-full border p-3 rounded" value={formData.insuranceNumber} onChange={handleChange} />
                    </div>



                    <div>
                        <label className="block font-semibold mb-1">1. Beschreiben Sie das aktuelle Hautproblem so detailliert wie möglich (max. 1500 Zeichen):</label>
                        <textarea
                            name="hautproblem"
                            maxLength={1500}
                            placeholder="Krankheitsbeginn, Krankheitsverlauf, Ausdehnung des Hautbefundes, Juckreiz, Brennen, Fieber, ..."
                            value={formData.hautproblem}
                            onChange={handleChange}
                            className="w-full border p-3 rounded"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">2. Seit wann besteht aktuell dieses Problem?</label>
                        <select
                            name="dauer"
                            value={formData.dauer}
                            onChange={handleChange}
                            className="w-full border p-3 rounded"
                        >
                            <option value="">bitte wählen</option>
                            <option value="seit < 3 Tagen">seit &lt; 3 Tagen</option>
                            <option value="seit 3-7 Tagen">seit 3–7 Tagen</option>
                            <option value="seit > 1 Woche">seit &gt; 1 Woche</option>
                            <option value="seit > 1 Monat">seit &gt; 1 Monat</option>
                            <option value="seit > 1 Jahr">seit &gt; 1 Jahr</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">3. Wie hat das Problem begonnen?</label>
                        <select
                            name="beginn"
                            value={formData.beginn}
                            onChange={handleChange}
                            className="w-full border p-3 rounded"
                        >
                            <option value="">bitte wählen</option>
                            <option value="plötzlich">plötzlich</option>
                            <option value="langsam">langsam</option>
                            <option value="weiss ich nicht">weiss ich nicht</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">4. Wurde bereits eine Behandlung durchgeführt? (z.B. Crèmes, Salben, Bäder, Tabletten, Spritzen)</label>
                        <select
                            name="behandlung"
                            value={formData.behandlung}
                            onChange={handleChange}
                            className="w-full border p-3 rounded"
                        >
                            <option value="">Bitte wählen</option>
                            <option value="ja">Ja</option>
                            <option value="nein">Nein</option>
                        </select>
                        {formData.behandlung === 'ja' && (
                            <>
                                <textarea
                                    name="behandlungText"
                                    onChange={handleChange}
                                    placeholder="Welche Behandlung (z.B. Crèmes, Salben, Tabletten)?"
                                    className="w-full border p-3 rounded mt-2"
                                    rows={3}
                                />

                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Medikamente</h4>
                                    {medikamente.map((med, index) => (
                                        <div key={index} className="mb-4 border p-3 rounded">
                                            <input
                                                type="text"
                                                value={med.name}
                                                onChange={(e) => handleMedikamentChange(index, 'name', e.target.value)}
                                                placeholder="Name des Medikaments"
                                                className="w-full border p-2 rounded mb-2"
                                            />
                                            <select
                                                value={med.frequenz}
                                                onChange={(e) => handleMedikamentChange(index, 'frequenz', e.target.value)}
                                                className="w-full border p-2 rounded mb-2"
                                            >
                                                <option value="">Frequenz wählen</option>
                                                <option value="mehrmals täglich">mehrmals täglich</option>
                                                <option value="1x/Tag (regelmässig)">1x/Tag (regelmässig)</option>
                                                <option value="häufiger als 1x/Woche">häufiger als 1x/Woche</option>
                                                <option value="seltener als 1x/Woche">seltener als 1x/Woche</option>
                                            </select>
                                            <select
                                                value={med.seit}
                                                onChange={(e) => handleMedikamentChange(index, 'seit', e.target.value)}
                                                className="w-full border p-2 rounded"
                                            >
                                                <option value="">Seit wann?</option>
                                                <option value="seit wenigen Tagen">seit wenigen Tagen</option>
                                                <option value="seit über einer Woche">seit über einer Woche</option>
                                                <option value="seit über einem Monat">seit über einem Monat</option>
                                                <option value="seit über einem Jahr">seit über einem Jahr</option>
                                                <option value="seit dem TT.MM.JJJJ">seit dem TT.MM.JJJJ</option>
                                            </select>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addMedikament}
                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        + Medikament hinzufügen
                                    </button>
                                </div>
                            </>
                        )}
                    </div>




                    <div>
                        <label className="block font-semibold mb-1">5. Bestanden diese oder andere Hautveränderungen schon mal in der Vergangenheit?</label>
                        <select
                            name="vergangenheit"
                            value={formData.vergangenheit}
                            onChange={handleChange}
                            className="w-full border p-3 rounded"
                        >
                            <option value="">Bitte wählen</option>
                            <option value="ja">Ja</option>
                            <option value="nein">Nein</option>
                        </select>
                        {formData.vergangenheit === 'ja' && (
                            <textarea
                                name="vergangenheitText"
                                onChange={handleChange}
                                placeholder="z.B. Ekzem, mit Salbe erfolgreich behandelt. Beschreiben Sie die Vorgeschichte. Wurde bereits eine Diagnose gestellt? Welche Therapie wurde damals durchgeführt? War diese Therapie erfolgreich?."
                                className="w-full border p-3 rounded mt-2"
                                rows={3}
                            />
                        )}
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">6. Bestehen weitere Krankheitssymptome oder Vorerkrankungen??</label>
                        <select
                            name="allergien"
                            value={formData.vorerkrankungen}
                            onChange={handleChange}
                            className="w-full border p-3 rounded"
                        >
                            <option value="">Bitte wählen</option>
                            <option value="ja">Ja</option>
                            <option value="nein">Nein</option>
                        </select>
                        {formData.allergien === 'ja' && (
                            <textarea
                                name="vorerkrankungenText"
                                onChange={handleChange}
                                placeholder="z.B. Fieber, Bluthochdruck, Blutzucker, ..."
                                className="w-full border p-3 rounded mt-2"
                                rows={3}
                            />
                        )}
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">7. Sind Allergien bekannt?</label>
                        <select
                            name="allergien"
                            value={formData.allergien}
                            onChange={handleChange}
                            className="w-full border p-3 rounded"
                        >
                            <option value="">Bitte wählen</option>
                            <option value="ja">Ja</option>
                            <option value="nein">Nein</option>
                        </select>
                        {formData.allergien === 'ja' && (
                            <textarea
                                name="allergienText"
                                onChange={handleChange}
                                placeholder="Welche Allergien?"
                                className="w-full border p-3 rounded mt-2"
                                rows={3}
                            />
                        )}
                    </div>



                    <div>
                        <label className="block font-semibold mb-1">8. Fotos, gff. mit Versichertenkarte an <b>spyglass@hin.ch</b> mailen</label>
                        {/* <input type="file" multiple className="w-full p-2 border rounded mb-2" /> */}
                        <p className="text-sm text-gray-600">
                            <b>Betreff:</b> Hautproblem-ID: <span className="font-mono">{patientId}</span>
                        </p>
                    </div>


                    <div className="bg-gray-100 border p-4 rounded text-sm space-y-2">
                        <p>
                            Mir ist bekannt, dass es sich bei der hier angebotenen Leistung und allfälligen Folgeleistungen über diese Plattform um eine Selbstzahlerleistung handeln kann, welche i.d.R. nicht von der gesetzlichen Krankenversicherung erstattet wird. Mit dem Abschliessen der Anfrage bestätigen Sie, dass der Patient in der Schweiz obligatorisch krankenversichert ist.
                        </p>
                        <p>
                            Ich akzeptiere die allgemeinen Nutzungsbedingungen von Derma2go AG. Die Datenschutzerklärung von Derma2go AG finden Sie hier.
                        </p>
                        {/* <p>
                            Bitte senden Sie mir widerruflich Informationen zu meiner Haut, Empfehlungen zur Therapie von Hautbeschwerden sowie Mitteilungen zur Qualitätssicherung via E-Mail.
                        </p> */}
                        <p>
                            Sie, bzw. der Patient verzichtet auf eine vorherige Aufklärung zu Art, Umfang, Durchführung, zu erwartenden Folgen und Risiken der Behandlung sowie ihrer Notwendigkeit, Dringlichkeit, Eignung und Erfolgsaussichten im Hinblick auf die Diagnose oder die Therapie. Sie verzichten weiter auf eine Information zu Alternativen zur Massnahme, insbesondere die Alternativen zu einer Fernbehandlung.
                        </p>
                    </div>





                    {/* all your input fields and selects (move them inside this form) */}

                    <div className="text-center space-x-4">
                        <button
                            type="submit"
                            className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
                        >
                            Anfrage absenden
                        </button>

                        <button
                            type="button"
                            onClick={downloadJSON}
                            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
                        >
                            Als JSON lokal speichern
                        </button>
                    </div>

                    {/* Feedback after submission */}
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

                </div>
            </form>

            <PictureQualityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        </div>
    );
};
export default Dermatologie;
