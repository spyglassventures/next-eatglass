import React from "react";
import cirsConfig, { CIRSField } from "@/components/IntCIRS/cirsConfigHandler";

const defaultNTopOptionsSplit = 6

interface RenderedCirsEntryProps {
  entry: any;
  setEntry?: any;
  rawView?: boolean;
  editView?: boolean;
}

const RenderedCirsEntry: React.FC<RenderedCirsEntryProps> = (
  {
    entry,
    setEntry,
    rawView,
    editView
  }) => {

  rawView = rawView === undefined ? false : rawView;
  editView = editView === undefined ? false : editView;
  if (!rawView && setEntry === undefined) {
    console.warn("setEntry is undefined. This is not allowed.")
    return undefined;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEntry((prev) => ({ ...prev, [name]: value }));
  };

  const renderField = (
    key: string,
    rawView: boolean = false,
    editView: boolean = false
  ) => {
    /* render a single input field

    - Special treatment for hidden fields
    - splits options in buttons for most common ones and dropdown
      - default:
        - 6 or fewer options: only buttons
        - more than 6: only dropdown
      - cirsConfig.topOptionsAsButtons for given key: number of buttons
    */

    if (rawView && editView) {
      console.warn("rawView and editView are mutually exclusive.")
      return undefined;
    }

    const field = cirsConfig.getFieldAlias(key)
    if (field === undefined) return undefined;

    // hidden fields: only stored, not shown
    if (field.hidden) {
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

    let fieldInput;

    function getSelectOptions(field: CIRSField) {
      if (!Array.isArray(field.values)) {
        return { buttonOptions: [], dropdownOptions: [] };
      }
      let displayOptions = field.values;
      let nTopOptions =
        field.topNButtons ??
        (displayOptions.length <= defaultNTopOptionsSplit ? displayOptions.length : 0);
      if (editView && !displayOptions.includes(entry[key])) {
        // edit mode: if the stored option is not in options, add it as first choice
        nTopOptions = nTopOptions > 0 ? nTopOptions + 1 : 0;
        displayOptions = [entry[key], ...displayOptions];
      }
      const buttonOptions = displayOptions.slice(0, nTopOptions);
      const dropdownOptions = displayOptions.slice(nTopOptions);
      return { buttonOptions, dropdownOptions };
    }

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
              ? 'bg-primary text-white border-primary'
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

    if (rawView) {
      // display everything raw and read-only
      fieldInput = (
        <p>{(key == "created_at") ? entry["created_at"].toLocaleString("de") : entry[key]}</p>
      )
    } else if (!Array.isArray(field.values)) {
      if (editView && field.immutable) {
        return undefined
      } else {
        // free text field
        fieldInput = (
          <textarea
            name={key}
            value={entry[key]}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        );
      }
    } else {
      // selection by buttons or dropdown
      const { buttonOptions, dropdownOptions } = getSelectOptions(field);

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
    <>
      {
        Object.keys(entry).map(
          (x) => renderField(x, rawView, editView)
        ).filter((x) => x !== undefined)
      }
    </>
  )
}

export default RenderedCirsEntry;
