import configRaw from "../../config/cirsConfig.json";

export interface CIRSField {
  name: string;
  alias: string;
  label?: string;
  description?: string;
  values?: {string: string};
  valueLabels?: string[];
  default?: string | number;
  topNButtons?: number;
  freetextLength?: number;
  hidden: false;
}

const cirsFieldFromConfig = (config: any) => {
  config["alias"] = config["alias"] ?? config["name"];
  return config as CIRSField;
};

const getCIRSConfig = (config) => {
  const fields: { string: CIRSField } = {} as { string: CIRSField };
  config.fields.map((x) => {
    fields[x.name] = cirsFieldFromConfig(x);
  });
  return {
    fields: fields,
    getField: (name: string): CIRSField => {
      return fields[name];
    },
    getFieldAlias: (alias: string): CIRSField | undefined => {
      for (const key in fields) {
        if (fields[key].alias === alias) {
          return fields[key];
        }
      }
      return undefined;
    },
  };
};

const cirsConfig = getCIRSConfig(configRaw);

export default cirsConfig;
