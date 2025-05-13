// pages/brett.tsx
import React, { useState } from "react";
import cirsConfig from "@/components/IntBrett/cirsConfigHandler";
import RenderedCirsEntry from "@/components/IntBrett/renderedCirsEntry";
import { CIRSEntry } from "@/components/IntBrett/dtypes";

const initialCIRSEntry: Omit<CIRSEntry, "id" | "fallnummer" | "created_at"> = {
    praxis_id: cirsConfig.getField("praxisId").default as number,
    fachgebiet: cirsConfig.getField("fachgebiet").default as string,
    ereignis_ort: "",
    ereignis_tag: "",
    versorgungsart: "",
    asa_klassifizierung: "",
    patientenzustand: "",
    begleitumstaende: "",
    medizinprodukt_beteiligt: "",
    fallbeschreibung: "",
    positiv: "",
    negativ: "",
    take_home_message: "",
    haeufigkeit: "",
    berichtet_von: "",
    berufserfahrung: "",
    bemerkungen: "",
};


const CirsCreate = () => {
    const [entry, setEntry] = useState(initialCIRSEntry);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = async () => {
        setFeedback('⏳ Speichern...');
        try {
            const res = await fetch('/api/cirs/v1/cirs', {
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

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">CIRS-Fall erfassen</h1>
            <div className="bg-white p-6 shadow rounded space-y-4">
                <RenderedCirsEntry entry={entry} setEntry={setEntry} />
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-primary text-white rounded hover:bg-primary"
                    >
                        Fall senden
                    </button>
                </div>
                {feedback && <p className="text-sm mt-2 text-center">{feedback}</p>}
            </div>
        </div>
    );
};

export default CirsCreate;
