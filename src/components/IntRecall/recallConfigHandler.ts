import configRaw from "../../config/recallConfig.json";
import getFieldConfig from "@/components/Common/CrudForms/fieldConfig";

const recallConfig = getFieldConfig(configRaw);

export default recallConfig;
