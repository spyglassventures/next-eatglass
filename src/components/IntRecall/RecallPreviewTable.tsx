// components/Recall/RecallPreviewTable.tsx
import React, { useMemo } from "react";
import { format, parseISO, isBefore } from "date-fns";

interface Props {
    rows: any[];
    setRows: (rows: any[]) => void;
}

const recallIntervalMapping: Record<string, number> = {
    "Jahreskontrolle": 365,
    "Kontrolle nach 6 Wochen": 42,
    "Nachsorge": 90,
};

const RecallPreviewTable: React.FC<Props> = ({ rows, setRows }) => {
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