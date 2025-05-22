import React from "react";
import { Controller } from "react-hook-form";
import { FormField } from "@/components/Common/CrudForms/fieldConfig";

const defaultNTopOptionsSplit = 6;

export const getSelectOptions = (
  field: FormField,
  currentValue: any,
  editView: boolean = false,
) => {
  if (!Array.isArray(field.values)) {
    return { buttonOptions: [], dropdownOptions: [] };
  }
  let displayOptions = field.values;
  let nTopOptions =
    field.topNButtons ??
    (displayOptions.length <= defaultNTopOptionsSplit
      ? displayOptions.length
      : 0);
  if (editView && !displayOptions.includes(currentValue)) {
    // edit mode: if the stored option is not in options, add it as first choice
    nTopOptions = nTopOptions > 0 ? nTopOptions + 1 : 0;
    displayOptions = [currentValue, ...displayOptions];
  }
  const buttonOptions = displayOptions.slice(0, nTopOptions);
  const dropdownOptions = displayOptions.slice(nTopOptions);
  return { buttonOptions, dropdownOptions };
};

interface CustomButtonProps {
  opt: string;
  useLabels: boolean;
  label: string;
  isActive: boolean;
  properties: { [key: string]: any };
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  opt,
  useLabels,
  label,
  isActive,
  properties,
}) => {
  const button = (
    <button
      key={`btn-${opt}`}
      type="button"
      className={`rounded border px-4 py-2 text-sm ${
        isActive
          ? "border-primary bg-primary text-white"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
      }`}
      {...properties}
    >
      {opt}
    </button>
  );
  if (useLabels) {
    return (
      <div className="flex flex-row items-start gap-2">
        {button}
        <label htmlFor={`btn-${opt}`} className="text-sm text-gray-500">
          <div dangerouslySetInnerHTML={{ __html: label || "" }} />
        </label>
      </div>
    );
  }
  return button;
};

interface ButtonDropdownProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  name: string;
  // error?: string; // Optional error message
  field: FormField;
  editView: boolean;
}

export const ButtonDropdown: React.FC<ButtonDropdownProps> = ({
  value,
  onChange,
  onBlur,
  name,
  field,
  editView,
}) => {
  if (name !== field.alias) {
    throw new Error(`field mismatch: ${name} vs. ${field.alias}`);
  }
  const { buttonOptions, dropdownOptions } = getSelectOptions(
    field,
    value,
    editView,
  );
  const handleButtonClick = (buttonValue: string) => {
    onChange(buttonValue); // Update react-hook-form's state
    onBlur(); // Mark the field as touched/blurred
  };
  return (
    <div className="flex flex-col space-y-2">
      {buttonOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {buttonOptions.map((opt: string, index: number) => (
            <CustomButton
              key={`btn-${name}-${index}`}
              opt={opt}
              useLabels={!!field.valueLabels}
              label={field.valueLabels ? field.valueLabels[opt] : ""}
              isActive={value === opt}
              properties={{
                onChange: () => onChange(opt),
                onBlur: () => onBlur(),
                onClick: () => handleButtonClick(opt),
              }}
            />
          ))}
        </div>
      )}
      {dropdownOptions.length > 0 && (
        <select
          id={name}
          name={name}
          // Show placeholder if value is from button
          value={dropdownOptions.includes(value) ? value : ""}
          onChange={(x) => {
            onChange(x.target.value);
          }}
          onBlur={() => onBlur()}
          className="w-full rounded border p-2"
        >
          <option value="">Weitere auswählen...</option>
          {dropdownOptions.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

interface ButtonDropdownControllerProps {
  name: string;
  control: any;
  formField: FormField;
  editView: boolean;
}

export const ButtonDropdownController: React.FC<
  ButtonDropdownControllerProps
> = ({ name, control, formField, editView }) => {
  return (
    <Controller
      name={name}
      control={control} // The control object from useForm
      render={({ field, fieldState }) => (
        <ButtonDropdown
          {...field} // Spreads name, value, onChange, onBlur
          field={formField}
          editView={editView}
        />
      )}
    />
  );
};

export interface FormStateInner {
  register: any;
  control?: any;
  errors?: any;
}
