// pages/brett.tsx
import React, { useState } from "react";
import DropzoneRecallUpload from "@/components/IntRecall/DropzoneRecallUpload";
import RecallPreviewTable from "@/components/IntRecall/RecallPreviewTable";
import RenderedRecallEntry from "@/components/IntRecall/renderedRecallEntry";
import { RecallEntry } from "@/components/IntRecall/dtypes";
import recallConfig from "@/components/IntRecall/recallConfigHandler";

const initialRecallEntry: Omit<RecallEntry, "id" | "created_at"> = {
    praxis_id: recallConfig.getField("praxisId").default as number,
    patientenname: "",
    geburtsdatum: "",
    kontaktart: "Telefon",
    kontaktinfo: "",
    erinnerungsanlass: "",
    recallsystem: "E-Mail",
    recall_datum: "",
    rueckmeldung_erhalten: false,
    naechster_termin: "",
    zusätzliche_laborwerte: "",
    zusätzliche_diagnostik: "",
    naechster_recall_in_tagen: 365,
    bemerkungen: "",
};

const RecallCreate = () => {
    const [entry, setEntry] = useState(initialRecallEntry);
    const [feedback, setFeedback] = useState("");
    const [parsedRows, setParsedRows] = useState<any[]>([]);

    const handleSubmit = async () => {
        setFeedback("⏳ Wird zur Datenbank hinzugefügt...");
        try {
            const res = await fetch("/api/recall/v1/recall", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(entry),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Fehler");
            setFeedback("✅ Eintrag gespeichert!");
            setEntry(initialRecallEntry);
        } catch (err: any) {
            setFeedback(`❌ Fehler: ${err.message}`);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Recall erfassen</h1>

            <a
                href="/data/recall/RecallBeispiel.xlsx"
                download
                className="text-sm text-blue-600 underline mb-4 inline-block"
            >
                📥 Beispiel-Excel-Datei herunterladen
            </a>

            <DropzoneRecallUpload onParsed={setParsedRows} />

            <RecallPreviewTable rows={parsedRows} setRows={setParsedRows} />

            <div className="bg-white p-6 shadow rounded space-y-4">
                <RenderedRecallEntry entry={entry} setEntry={setEntry} />
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                    >
                        Zur Datenbank hinzufügen
                    </button>
                </div>
                {feedback && <p className="text-sm mt-2 text-center">{feedback}</p>}
            </div>
        </div>
    );
};

export default RecallCreate;
