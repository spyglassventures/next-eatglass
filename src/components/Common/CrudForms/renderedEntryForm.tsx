import React from "react";
import { FormField } from "./fieldConfig";
import { ButtonDropdownController, FormStateInner } from "@/components/Common/CrudForms/formElements";

interface RenderFieldProps {
  field: FormField | undefined;
  formStateInner: FormStateInner;
  rawView?: boolean;
  editView?: boolean;
}

const RenderField: React.FC<RenderFieldProps> = (
  {
    field,
    formStateInner,
    rawView=false,
    editView=false,
  }
) => {
  /* render a single input field

  - Special treatment for hidden fields
  - splits options in buttons for most common ones and dropdown
    - default:
      - 6 or fewer options: only buttons
      - more than 6: only dropdown
    - see `FormField` for more render options
  */

  if (rawView && editView) {
    console.warn("rawView and editView are mutually exclusive.");
    return undefined;
  }

  if (!field) return undefined;

  // hidden fields: only stored, not shown
  if (field.hidden) {
    return (
      <input
        key={field.alias}
        type="hidden"
        {...formStateInner.register(field.alias)}
        readOnly
      />
    );
  }

  let fieldInput;

  if (rawView) {
    // display everything raw and read-only
    fieldInput = (
      <input key={field.alias} {...formStateInner.register(field.alias)} readOnly />
      // <p>{register(field.alias).value}</p>
    );
  } else if (!Array.isArray(field.values)) {
    if (editView && field.immutable) {
      return undefined;
    } else {
      // free text field
      fieldInput = (
        <>
          <textarea
            className="w-full rounded border p-2"
            rows={field.nRows ?? 3}
            {...formStateInner.register(field.alias)}
          />
          {formStateInner.errors[field.alias] && (
            <p className="mt-1 text-sm text-red-600">
              {formStateInner.errors[field.alias].message}
            </p>
          )}
        </>
      );
    }
  } else {
    // ToDo: date-picker with "today" button
    fieldInput = (
      <div className="flex flex-col space-y-2">
        <ButtonDropdownController
          name={field.alias}
          control={formStateInner.control}
          formField={field}
          editView={editView}
        />
        {formStateInner.errors[field.alias] && (
          <p className="mt-1 text-sm text-red-600">
            {formStateInner.errors[field.alias].message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      key={field.alias}
      className="grid grid-cols-1 items-start gap-4 border-b py-4 md:grid-cols-3"
    >
      <div>
        <label htmlFor={field.alias} className="mb-1 block font-semibold">
          {field.label || field.alias}
        </label>
        {field.description && (
          <p className="text-sm text-gray-500">{field.description}</p>
        )}
      </div>
      <div className="md:col-span-2">{fieldInput}</div>
    </div>
  );
};


interface RenderedEntryFormProps {
  fields: { [k: string]: FormField | undefined };
  formStateInner: FormStateInner;
  rawView?: boolean;
  editView?: boolean;
}

const RenderedEntryForm: React.FC<RenderedEntryFormProps> = ({
  fields,
  formStateInner,
  rawView,
  editView,
}) => {
  rawView = rawView ?? false;
  editView = editView ?? false;

  return (
    <>
      {Object.keys(fields)
        .map((x, index) => (
          <RenderField
            key={`renderfield-${x}-${index}`}
            field={fields[x]}
            formStateInner={formStateInner}
            rawView={rawView}
            editView={editView}
          />
        ))
        .filter((x) => x !== undefined)}
    </>
  );
};

export default RenderedEntryForm;
