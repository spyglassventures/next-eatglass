// Creation Tab of Recall
import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DropzoneRecallUpload from "@/components/IntRecall/DropzoneRecallUpload";
import RecallPreviewTable from "@/components/IntRecall/RecallPreviewTable";
import RenderedEntryForm from "@/components/Common/CrudForms/renderedEntryForm";
import recallConfig from "@/components/IntRecall/recallConfigHandler";
import {
  getSchemaKeys,
  RecallEntryCreateFrontend,
  RecallEntrySchemaAPICreate,
  TRecallEntryCreateFrontend
} from "@/components/IntRecall/RecallListSchemaV1";
import { FormStateInner } from "@/components/Common/CrudForms/formElements";
import TinyEventQueue from "@/components/Common/TinyEventQueue";


export const QueryFields = getSchemaKeys(RecallEntryCreateFrontend)

export const InitialRecallEntry: TRecallEntryCreateFrontend = (() => {

    const initialObj = {}
    for (const key of QueryFields) {
      const field = recallConfig.getFieldAlias(key)
      if (!!field) {
        initialObj[key] = field.default ?? ""
      } else {
        console.warn("missing key in recallConfig.json:", key)
        // ToDo: this should not render
        initialObj[key] = ""
      }
    }
    return initialObj as TRecallEntryCreateFrontend;
})();


const RecallCreateForm: React.FC<{
  initialEntry: TRecallEntryCreateFrontend | null;
  eventQueue: TinyEventQueue
}> = (
  {initialEntry, eventQueue}
) => {

  const [feedback, setFeedback] = useState("");

  const onSubmit = async (entry: TRecallEntryCreateFrontend) => {
      setFeedback("⏳ Wird zur Datenbank hinzugefügt...");
      try {
          const parsedData = RecallEntrySchemaAPICreate.parse(entry)
          const { ...values } = parsedData; // Extract values
          const res = await fetch("/api/recall/v1/recall", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
          });
          if (res.ok) {
            console.log('Form submitted successfully!');
            setFeedback("✅ Eintrag erfolgreich");
            reset();
            // notify listeners that an entry was created
            eventQueue.publish("recall-entry-created", null);
          } else {
            const errorData = await res.json();
            console.error('API submission failed:', errorData);
            setFeedback(`❌ Fehler: ${errorData.message || errorData.error}`);
          }
      } catch (err: any) {
          console.error('Network error or unexpected error:', err);
          setFeedback(`❌ Fehler: ${err.message} ${err.details ?? ""}`);
      }
  };

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(RecallEntryCreateFrontend),
    defaultValues: {...(initialEntry ?? InitialRecallEntry)},
    mode: "onTouched",
  });

  eventQueue.subscribe(
    "insert-create-recall-data",
    "recall-create-form-reset",
    ({data}) => {
      reset(data);
    }
  )

  const formStateInner: FormStateInner = {
    register: register,
    control: control,
    errors: errors,
  }

  return (
    <div className="bg-white p-6 shadow rounded space-y-4">
        <RenderedEntryForm
          fields={Object.fromEntries(
            Object.keys(RecallEntryCreateFrontend.shape).map(
              (x) => [x, recallConfig.getFieldAlias(x)]
            )
          )}
          formStateInner={formStateInner}
        />
        <div className="flex justify-end">
            <button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
                {isSubmitting ? 'Sende...' : 'Zur Datenbank hinzufügen'}
            </button>
        </div>
        {feedback && <p className="text-sm mt-2 text-center">{feedback}</p>}
    </div>
  )
}


const RecallCreate: React.FC<{eventQueue: TinyEventQueue}> = ({eventQueue}) => {

    const [parsedRows, setParsedRows] = useState<any[]>([]);


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

            <RecallPreviewTable
              rows={parsedRows}
              setRows={setParsedRows}
              eventQueue={eventQueue}
            />

            <RecallCreateForm
              initialEntry={null}
              eventQueue={eventQueue}
            />
        </div>
    );
};

export default RecallCreate;
