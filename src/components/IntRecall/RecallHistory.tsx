import React, { useEffect, useState } from "react";
import RenderedEntryForm from "@/components/Common/CrudForms/renderedEntryForm";
import {
  HeaderRowFactory,
  PreviewRowFactory,
} from "@/components/Common/CrudForms/previewTable";
import { editIcon, focusIcon } from "@/components/Common/CrudForms/icons";
import recallConfig from "@/components/IntRecall/recallConfigHandler";
import { QueryFields } from "@/components/IntRecall/RecallCreate";
import {
  RecallEntry,
  RecallEntryCreateFrontend,
  RecallEntrySchemaAPICreate,
  RecallEntrySchemaAPIRead,
  RecallEntrySchemaAPIUpdate,
  TRecallEntry, TRecallEntryCreateFrontend,
  TRecallEntrySchemaAPIUpdate
} from "@/components/IntRecall/RecallListSchemaV1";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormStateInner } from "@/components/Common/CrudForms/formElements";
import { exportToXlsx } from "@/components/Common/exportToXlsx";
import { format } from "date-fns";

const PreviewFields: string[] = ["id", ...QueryFields, "created_at"];

const ReadOnlyView: React.FC<{
  formStateInner: FormStateInner;
  setUpdateSelected: (x: boolean) => void;
}> = ({ formStateInner, setUpdateSelected }) => {
  return (
    <>
      <div className="flex w-full items-center justify-between p-4">
        <button
          onClick={() => {
            setUpdateSelected(true);
          }}
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
        >
          Bearbeiten
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <RenderedEntryForm
          fields={Object.fromEntries(
            Object.keys(RecallEntryCreateFrontend.shape).map((x) => [
              x,
              recallConfig.getFieldAlias(x),
            ]),
          )}
          formStateInner={formStateInner}
          rawView={true}
        />
      </div>
    </>
  );
};

const UpdateView: React.FC<{
  formStateInner: FormStateInner;
  feedback: string | undefined;
  isSubmitting: boolean;
  submitHandler: (x) => void;
  deleteHandler: () => void;
}> = ({ formStateInner, feedback, isSubmitting, submitHandler, deleteHandler}) => {
  return (
    <>
      <div className="flex w-full items-center justify-between p-4">
        <button
          onClick={submitHandler}
          disabled={isSubmitting}
          className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
        >
          Update senden
        </button>
        <button
          onClick={deleteHandler}
          className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
        >
          Eintrag löschen!
        </button>
      </div>
      {feedback && <p className="mt-2 text-center text-sm">{feedback}</p>}
      <div className="flex-1 overflow-auto p-4">
        <RenderedEntryForm
          fields={Object.fromEntries(
            Object.keys(RecallEntryCreateFrontend.shape).map((x) => [
              x,
              recallConfig.getFieldAlias(x),
            ]),
          )}
          formStateInner={formStateInner}
          editView={true}
        />
      </div>
    </>
  );
};

interface SelectionViewProps {
  selectedEntry: TRecallEntry;
  updateSelected: boolean;
  onSubmit: (entry: TRecallEntry) => void;
  handleDelete: () => void;
  closeModal: () => void;
  feedback: string;
  setUpdateSelected: any;
}

const SelectionView: React.FC<SelectionViewProps> = ({
  selectedEntry,
  updateSelected,
  onSubmit,
  handleDelete,
  closeModal,
  feedback,
  setUpdateSelected,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RecallEntry),
    defaultValues: {...selectedEntry},
    mode: "onTouched",
  });

  const formStateInner: FormStateInner = {
    register: register,
    control: control,
    errors: errors,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={closeModal}
    >
      <div
        className="flex flex-col rounded bg-white shadow-lg"
        style={{ width: "85vw", height: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">
            Log Details (ID: {selectedEntry.id})
          </h2>
          <button
            onClick={closeModal}
            className="text-2xl leading-none text-gray-500 hover:text-gray-700"
            title="Close"
          >
            &times;
          </button>
        </div>
        {!updateSelected &&
          <ReadOnlyView
            formStateInner={formStateInner}
            setUpdateSelected={setUpdateSelected}
          />
        }
        {updateSelected &&
          <UpdateView
            formStateInner={formStateInner}
            feedback={feedback}
            isSubmitting={isSubmitting}
            submitHandler={handleSubmit(onSubmit)}
            deleteHandler={handleDelete}
          />
        }
      </div>
    </div>
  );
};

interface RecallTableProps {
  recallHistory: TRecallEntry[];
  setRecallHistory: (history: TRecallEntry[]) => void;
  loadMore: () => void;
  loading: boolean;
}

const RecallTable: React.FC<RecallTableProps> = ({
  recallHistory,
  setRecallHistory,
  loadMore,
  loading,
}) => {
  // UPDATE hook
  const [updateSelected, setUpdateSelected] = useState<boolean>(false);
  const [selectedEntry, setSelectedEntry] = useState<TRecallEntry | null>(null);
  const [feedback, setFeedback] = useState("");

  const onSubmit = async (entry: TRecallEntry) => {
    setFeedback("⏳ Speichern...");
    if (!entry) {
      setFeedback("❌ Fehler: Kein Eintrag ausgewählt.");
      return;
    }
    try {
      RecallEntrySchemaAPICreate.parse(entry); // Validate entry
      const originalEntry = recallHistory.find(
        (x) => x.id === entry.id,
      );
      if (!originalEntry) {
        setFeedback(
          `❌ Fehler: Originaleintrag mit ID ${entry.id} nicht gefunden. `
          + "Kann Änderungen nicht vergleichen.",
        );
        return;
      }
      console.log(originalEntry);

      const differences: TRecallEntrySchemaAPIUpdate = {};

      let hasChanges = false;
      // Compare selectedEntry with originalEntry and find differences
      for (const key in entry) {
        if (Object.prototype.hasOwnProperty.call(entry, key)) {
          const typedKey = key as keyof TRecallEntry;
          if (entry[typedKey] !== originalEntry[typedKey]) {
            differences[typedKey] = entry[typedKey];
            hasChanges = true;
          }
        }
      }
      if (!hasChanges) {
        setFeedback("ℹ️ Keine Änderungen zu Speichern festgestellt.");
        return;
      }
      console.log(differences);
      const payload = {
        id: entry.id,
        updates: RecallEntrySchemaAPIUpdate.parse(differences),
      };
      const res = await fetch("/api/recall/v1/pg_updateRecall", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(
          responseData.error || "Fehler beim Speichern der Änderungen",
        );
      }
      setFeedback("✅ Änderungen erfolgreich gespeichert!");
      // replace entry in global list
      const updatedEntry = RecallEntrySchemaAPIRead.parse(
        responseData.updatedEntry,
      ) as TRecallEntry;
      setRecallHistory(
        recallHistory.map((x) =>
          x.id === updatedEntry.id ? updatedEntry : x,
        ),
      );
    } catch (err: any) {
      setFeedback(`❌ Fehler: ${err.message}`);
      console.log(err);
    }
  };

  const handleDelete = async () => {
    setFeedback("⏳ Löschen...");
    if (!selectedEntry) {
      setFeedback("❌ Fehler: Kein Eintrag ausgewählt.");
      return;
    }
    try {
      const payload = {
        id: selectedEntry.id,
      };

      const res = await fetch("/api/recall/v1/pg_deleteRecall", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(
          responseData.error || "Fehler beim Löschen des Eintrags",
        );
      }

      setFeedback("✅ Eintrag erfolgreich gelöscht!");

      // Remove entry from global list
      setRecallHistory(
        recallHistory.filter((entry) => entry.id !== selectedEntry.id),
      );

      closeModal(); // Close modal after deletion
    } catch (err: any) {
      setFeedback(`❌ Fehler: ${err.message}`);
      console.log(err);
    }
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setUpdateSelected(false);
  };

  return (
    <>
      <div className="px-4">
        <div className="overflow-x-auto">
          <table
            className="table-auto divide-y divide-gray-200 border text-xs"
            style={{ minWidth: "1600px" }}
          >
            {HeaderRowFactory(PreviewFields)}
            <tbody className="bg-white">
              {recallHistory.map((entry) => (
                <tr key={entry.id}>
                  {/* ID cell with functional buttons */}
                  <td className="flex justify-end space-x-1 border px-4 py-2">
                    <span>{entry.id}</span>
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      title="View Details"
                      className="focus:outline-none"
                    >
                      {focusIcon("text-blue-500")}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEntry(entry);
                        setUpdateSelected(true);
                      }}
                      title="Edit Details"
                      className="focus:outline-none"
                    >
                      {editIcon("text-green-500")}
                    </button>
                  </td>
                  {/* all other cells, skip id and created_at */}
                  {PreviewRowFactory(entry, PreviewFields.slice(1, -1))}
                  {/* created_at cell */}
                  <td className="border px-4 py-2">
                    {entry.created_at
                      ? entry.created_at.toLocaleString("de")
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded bg-blue-500 px-4 py-2 text-xs text-white hover:bg-blue-600"
          >
            Mehr Einträge laden
          </button>
        </div>
      </div>

      {selectedEntry && (
        <SelectionView
          selectedEntry={selectedEntry}
          updateSelected={updateSelected}
          onSubmit={onSubmit}
          handleDelete={handleDelete}
          closeModal={closeModal}
          feedback={feedback}
          setUpdateSelected={setUpdateSelected}
        />
      )}
    </>
  );
};

const RecallHistory: React.FC = () => {
  const [recallHistory, setRecallHistory] = useState<TRecallEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [offset, setOffset] = useState(0);
  const limit = 20; // Load 20 rows at a time

  // Initial load on component mount.
  useEffect(() => {
    const initialFetch = async () => {
      const RecallHistory = await fetchRecallHistory(0);
      setRecallHistory(RecallHistory);
      setLoading(false);
    };
    initialFetch();
  }, []);

  const fetchRecallHistory = async (
    offsetParam = 0,
  ): Promise<TRecallEntry[]> => {
    try {
      // clear error
      setError("");
      // Build the URL with query parameters based on the filter state.
      let url = `/api/recall/v1/pg_getRecall?limit=${limit}&offset=${offsetParam}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Error fetching logs");
      }
      const data = await res.json();
      console.log(data);
      return data.recallEntries.map((x) =>
        RecallEntrySchemaAPIRead.parse(x),
      ) as TRecallEntry[];
    } catch (err: any) {
      setError(err.message);
      console.log(err);
      return [];
    }
  };

  const loadMore = async () => {
    setLoading(true);
    const newOffset = offset + limit;
    const moreRecallHistory = await fetchRecallHistory(newOffset);
    setRecallHistory((prev) => [...prev, ...moreRecallHistory]);
    setOffset(newOffset);
    setLoading(false);
  };

  const refreshHistory = async () => {
    setLoading(true);
    setOffset(0);
    const refreshedHistory = await fetchRecallHistory(0);
    console.log(refreshedHistory);
    setRecallHistory(refreshedHistory);
    setLoading(false);
  };

  const handleDownloadXLSX = () => {
    exportToXlsx(
      recallHistory,
      `recall_history_${format(new Date(), "yyyyMMddTHHmmss")}.xlsx`,
    );
  };

  return (
    // Full-width container with no horizontal padding or max-width restrictions.
    <div className="w-full" style={{ margin: 0, padding: 0 }}>
      <div className="mb-4 flex items-center justify-between px-4">
        <h1 className="text-2xl font-bold">Recall Historie</h1>
        <button
          onClick={refreshHistory}
          className="rounded bg-green-500 px-4 py-2 text-xs text-white hover:bg-green-600"
          disabled={loading}
        >
          Aktualisieren
        </button>
        <button
          onClick={handleDownloadXLSX}
          className="rounded bg-green-500 px-4 py-2 text-xs text-white hover:bg-green-600"
        >
          Download as XLSX
        </button>
      </div>

      {loading && <p className="px-4 text-xs">Loading history...</p>}
      {error && <p className="px-4 text-xs text-red-500">Error: {error}</p>}
      {!loading && recallHistory.length === 0 && (
        <p className="px-4 text-xs">No history found.</p>
      )}
      {!loading && recallHistory.length > 0 && (
        <RecallTable
          recallHistory={recallHistory}
          setRecallHistory={setRecallHistory}
          loadMore={() => loadMore()}
          loading={loading}
        />
      )}
    </div>
  );
};

export default RecallHistory;
