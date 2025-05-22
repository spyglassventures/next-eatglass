// pages/brett.tsx
import React, { useState } from "react";
import cirsConfig from "@/components/IntCIRS/cirsConfigHandler";
import RenderedCirsEntry from "@/components/IntCIRS/renderedCirsEntry";
import { CIRSEntry } from "@/components/IntCIRS/dtypes";
import TinyEventQueue from "@/components/Common/TinyEventQueue";

const initialCIRSEntry: Omit<CIRSEntry, "id" | "fallnummer" | "created_at" | "praxis_id"> = {
    fachgebiet: (
      cirsConfig.getField("fachgebiet") ?? {default: ""}
    ).default as string,
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


const CirsCreate: React.FC<{eventQueue: TinyEventQueue}> = ({eventQueue}) => {
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
            // notify listeners that an entry was created
            eventQueue.publish("cirs-entry-created", null);
        } catch (err: any) {
            setFeedback(`❌ Fehler: ${err.message}`);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">CIRS erfassen</h1>
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
