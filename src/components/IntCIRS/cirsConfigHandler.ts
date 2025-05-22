import configRaw from "../../config/cirsConfig.json";
import getFieldConfig, { FormField } from "@/components/Common/CrudForms/fieldConfig";

export interface CIRSField extends FormField {}

const cirsConfig = getFieldConfig(configRaw);

export default cirsConfig;
