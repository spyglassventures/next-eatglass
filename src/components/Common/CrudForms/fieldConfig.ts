const PraxisIdDefault = 100;

interface FormFieldRaw {
  name: string;
  alias?: string;  // API-query field name (may be same as database)
  label?: string;  // Label in web view
  description?: string;  // explanation given in web view
  values?: string[];  // options button and/or dropdown; textarea if empty
  valueLabels?: { string: string };  // optional mapping of value -> label
  default?: string | number;  // initial value in creation view
  topNButtons?: number;  // display N first values as buttons
  freetextLength?: number;  // limitation of textarea
  nRows?: number;  // rows parameter of textarea
  immutable?: boolean;  // not modifiable in update view
  hidden?: boolean;  // not shown at all. E.g. inactive fields
  inPreview?: boolean;  // show in tabular overview
}

export interface FormField extends FormFieldRaw {
  // make fields non-optional
  alias: string;  // always expected
  immutable: boolean;  // error-prone if a boolean can be undefined
  hidden: boolean;  // error-prone if a boolean can be undefined
  inPreview: boolean;  // error-prone if a boolean can be undefined
}

interface FormFieldRawConfig {
  fields: FormFieldRaw[];
  praxisID?: number;
}

const formFieldFromConfig = (config: FormFieldRaw) => {
  config.alias = config.alias ?? config.name;
  config.immutable = config.immutable ?? false;
  config.hidden = config.hidden ?? false;
  config.inPreview = config.inPreview ?? false;
  return config as FormField;
};

export interface FieldConfig {
  fields: { string: FormField };
  praxisID: number;
  getField: (name: string) => FormField | undefined;
  getFieldAlias: (alias: string) => FormField | undefined;
}

const getFieldConfig = (config: FormFieldRawConfig): FieldConfig => {
  const fields: { string: FormField } = {} as { string: FormField };
  config.fields.map((x) => {
    fields[x.name] = formFieldFromConfig(x);
  });
  const praxisID: string | number = process.env.PRAXIS_ID ?? config.praxisID ?? PraxisIdDefault;
  return {
    fields: fields,
    praxisID: typeof praxisID == "string" ? parseInt(praxisID) : praxisID,
    getField: (name: string): FormField => {
      return fields[name];
    },
    getFieldAlias: (alias: string): FormField | undefined => {
      for (const key in fields) {
        if (fields[key].alias === alias) {
          return fields[key];
        }
      }
      return undefined;
    },
  };
};

export default getFieldConfig;
