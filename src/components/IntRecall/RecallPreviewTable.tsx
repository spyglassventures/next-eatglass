// components/Recall/RecallPreviewTable.tsx
import React, { useMemo } from "react";
import { format, parseISO, isBefore } from "date-fns";
import { InitialRecallEntry } from "@/components/IntRecall/RecallCreate";
import TinyEventQueue from "@/components/Common/TinyEventQueue";

interface Props {
    rows: any[];
    setRows: (rows: any[]) => void;
    eventQueue: TinyEventQueue;
}

const recallIntervalMapping: Record<string, number> = {
    "Jahreskontrolle": 365,
    "Kontrolle nach 6 Wochen": 42,
    "Nachsorge": 90,
};

const RecallPreviewTable: React.FC<Props> = ({ rows, setRows, eventQueue }) => {
    const handleContact = (index: number, type: "whatsapp" | "email") => {
        const newRows = [...rows];
        newRows[index].Status = `kontaktiert via ${type}`;
        setRows(newRows);
    };

    const handleMarkAsDone = (index: number, intervalLabel: string) => {
        const interval = recallIntervalMapping[intervalLabel] || 180;
        const nextRecallDate = new Date();
        nextRecallDate.setDate(nextRecallDate.getDate() + interval);
        const newRows = [...rows];
        newRows[index].Status = "abgeschlossen";
        newRows[index]["Nächster Recall"] = format(nextRecallDate, "yyyy-MM-dd");
        setRows(newRows);
    };

    const isDue = (datum: string) => {
        try {
            return isBefore(parseISO(datum), new Date());
        } catch {
            return false;
        }
    };

    const updateCreationForm = (row) => {
      const newRecallEntry = { ...InitialRecallEntry}
      if ("id" in row && "created_at" in row) {
        for (const key in row) {
          if (key in newRecallEntry) {
            newRecallEntry[key] = row[key]
          }
        }
        eventQueue.publish("insert-create-recall-data", newRecallEntry);
      }
      const fieldMapping: {key: string, fieldAlias: string} = Object.fromEntries(
        [
          ["Patient ID", "patient_id"],
          ["Vorname", "vorname"],
          ["Nachname", "nachname"],
          ["Geburtsdatum", "geburtsdatum"],
          ["Kontaktart", "recallsystem"],
          ["Kontaktinfo", "kontaktinfo"],
          ["Erinnerungsanlass", "erinnerungsanlass"],
          ["Ziel-Termin", "recall_target_datum"],
          ["Reminder-Datum", "reminder_send_date"],
          ["Bemerkungen", "bemerkungen"],
        ]
      )
      const periodMapping: {key: string, period: string} = Object.fromEntries(
        [
          ["W", "weeks"],
          ["M", "months"],
          ["Y", "yearly"],
          ["J", "yearly"],
          ["O", "once"],
        ]
      )
      for (const [key, fieldAlias] of Object.entries(fieldMapping)) {
        let row_val = row[key]
        if (typeof row_val === "string") {
          row_val = row_val.trim()
        }
        if (row_val !== undefined && row_val !== "" && fieldAlias in newRecallEntry) {
          newRecallEntry[fieldAlias] = row_val
        }
      }
      const recallInterval = (row["Recall Intervall"] ?? "").trim()
      if (!!recallInterval) {
        const regex = /^(\d+)([WMYJO])$/;
        const match = recallInterval.match(regex);
        newRecallEntry["periodicity_interval"] = parseInt(match[1])
        newRecallEntry["periodicity_unit"] = periodMapping[match[2]]
      }
      const rueckmeldung_erhalten = row["Rückmeldung erhalten"]
      if (typeof rueckmeldung_erhalten === "boolean") {
        newRecallEntry["rueckmeldung_erhalten"] = rueckmeldung_erhalten ? "Ja" : "Nein"
      }
      console.log(newRecallEntry);
      eventQueue.publish("insert-create-recall-data", newRecallEntry);
    }

    const headers = useMemo(() => rows.length > 0 ? Object.keys(rows[0]) : [], [rows]);

    return (
        <div className="overflow-x-auto mb-6">
            <table className="min-w-full text-sm text-left border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        {headers.map((key) => (
                            <th key={key} className="p-2 border">{key}</th>
                        ))}
                        <th className="p-2 border">Fällig?</th>
                        <th className="p-2 border">Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => {
                        const recallDate = row["Recall-Datum"];
                        const faellig = isDue(recallDate);
                        return (
                            <tr key={i} className={faellig ? "bg-red-50" : ""}>
                                {headers.map((key) => (
                                    <td key={key} className="p-2 border">{row[key]}</td>
                                ))}
                                <td className="p-2 border text-center">{faellig ? "⚠️ Ja" : ""}</td>
                                <td className="p-2 border space-y-1">
                                    <button
                                        onClick={() => handleContact(i, "whatsapp")}
                                        className="text-green-600 underline text-xs block"
                                    >
                                        WhatsApp schreiben
                                    </button>
                                    <button
                                        onClick={() => handleContact(i, "email")}
                                        className="text-blue-600 underline text-xs block"
                                    >
                                        E-Mail schreiben
                                    </button>
                                    <button
                                        onClick={() => handleMarkAsDone(i, row["Erinnerungsanlass"])}
                                        className="text-gray-700 underline text-xs block"
                                    >
                                        ✅ Termin stattgefunden – Recall planen
                                    </button>
                                    <button
                                        onClick={() => updateCreationForm(row)}
                                        className="text-orange-700 underline text-xs block"
                                    >
                                        ⇓ Daten übernehmen
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default RecallPreviewTable;
