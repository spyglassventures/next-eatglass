import React, { useState } from 'react';

const Dermatologie = () => {
    const [formData, setFormData] = useState({
        hautproblem: '',
        dauer: '',
        behandlung: '',
        beginn: '', // 👈 neu
        behandlungText: '',
        vergangenheit: '',
        vergangenheitText: '',
        allergien: '',
        allergienText: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 flex items-center justify-center py-16 px-4">
            <div className="max-w-4xl w-full space-y-12">
                <h1 className="text-center text-3xl font-semibold">Online-Hautfragebogen</h1>

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

                <form className="space-y-6">
                    <div>
                        <label className="block font-semibold mb-1">1. Beschreiben Sie das aktuelle Hautproblem so detailliert wie möglich (max. 1500 Zeichen):</label>
                        <textarea
                            name="hautproblem"
                            maxLength={1500}
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
                        <label className="block font-semibold mb-1">3. Wurde bereits eine Behandlung durchgeführt?</label>
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
                            <textarea
                                name="behandlungText"
                                onChange={handleChange}
                                placeholder="Welche Behandlung (z.B. Crèmes, Salben, Tabletten)?"
                                className="w-full border p-3 rounded mt-2"
                                rows={3}
                            />
                        )}
                    </div>

                    <div>
    <label className="block font-semibold mb-1">4. Wie hat das Problem begonnen?</label>
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
                        <label className="block font-semibold mb-1">4. Bestanden diese oder andere Hautveränderungen schon einmal?</label>
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
                                placeholder="Bitte beschreiben Sie diese."
                                className="w-full border p-3 rounded mt-2"
                                rows={3}
                            />
                        )}
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">5. Sind Allergien bekannt?</label>
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
                        <label className="block font-semibold mb-1">6. Fotos hochladen:</label>
                        <input type="file" multiple className="w-full p-2 border rounded" />
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
                        >
                            Anfrage absenden
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Dermatologie;
