// pages/brett.tsx
import React, { useState } from "react";
import cirsConfig from "@/components/IntBrett/cirsConfigHandler";
import { CIRSEntry } from "@/components/IntBrett/CirsHistory";

const defaultNTopOptionsSplit = 6

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEntry((prev) => ({ ...prev, [name]: value }));
    };

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

    const renderField = (key: string) => {
      /* render a single input field

      - Special treatment for hiddenFields
      - splits options in buttons for most common ones and dropdown
        - default:
          - 6 or fewer options: only buttons
          - more than 6: only dropdown
        - cirsConfig.topOptionsAsButtons for given key: number of buttons
      */
      
      const field = cirsConfig.getFieldAlias(key)
      if (field === undefined) return undefined;
      
      if (field.hidden) {
        // Nicht anzeigen, aber mitsenden
        return (
          <input
            key={field.alias}
            type="hidden"
            name={field.name}
            value={entry[field.alias]}
            readOnly
          />
        );
      }

      const options = field.values;

      let fieldInput;

      if (!Array.isArray(options)) {
        fieldInput = (
          <textarea
            name={key}
            value={entry[key]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        );
      } else {
        const nTopOptions = field.topNButtons ?? (
          (options.length <= defaultNTopOptionsSplit) ? options.length : 0
        )
        const buttonOptions = options.slice(0, nTopOptions);
        const dropdownOptions = options.slice(nTopOptions);

        const handleButtonClick = (value: string) => {
          setEntry((prev) => ({ ...prev, [key]: value }));
        };

        const makeButton = (opt: string, useLabels: boolean, label: string) => {
          const button = (
            <button
              key={opt}
              type="button"
              onClick={() => handleButtonClick(opt)}
              className={`px-4 py-2 border rounded text-sm
                                          ${entry[key] === opt
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
              }`}
            >
              {opt}
            </button>
          )
          if (useLabels) {
            return (
              <div className="flex flex-row items-start gap-2">
                {button}
                <label htmlFor={key} className="text-sm text-gray-500">
                  <div dangerouslySetInnerHTML={{ __html: label || "" }} />
                </label>
              </div>
            )
          }
          return button
        }

        fieldInput = (
          <div className="flex flex-col space-y-2">

            {buttonOptions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {buttonOptions.map(
                  (opt) => makeButton(
                    opt, !!field.valueLabels, field.valueLabels ? field.valueLabels[opt] : ""
                  )
                )}
              </div>
            )}
            {dropdownOptions.length > 0 && (
              <select
                id={key}
                name={key}
                // Show placeholder if value is from button
                value={dropdownOptions.includes(entry[key]) ? entry[key] : ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Weitere auswählen...</option>
                {dropdownOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}
          </div>
        );
      }

      return (
        <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-4 border-b">
          <div>
            <label htmlFor={key} className="block font-semibold mb-1">{field.label || key}</label>
            {field.description && <p className="text-sm text-gray-500">{field.description}</p>}
          </div>
          <div className="md:col-span-2">
            {fieldInput}
          </div>
        </div>
      );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">CIRS-Fall erfassen</h1>
            <div className="bg-white p-6 shadow rounded space-y-4">
                {Object.keys(initialCIRSEntry).map(renderField)}
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
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
