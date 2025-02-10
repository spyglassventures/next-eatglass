
// struc_diagnosen_extract_message.ts
import { z } from "zod";
import examplesData from '../../sidebar_examples/STRUC/extract_diagnose_sidebar_config.json';
import rawInitialMessages from '../../ai_forms/struc/ki_formulare_group_by.json';

export const warning_msg = 'Closed-Beta Test: WhatsApp Style / Mundart / Freiform eingeben ➜ Schriftdeutsch erhalten';

export const followupBtn = ['kuerzer schreiben', 'als Memo für den Chef schreiben', 'als E-Mail schreiben'];

// Cloud buttons (if applicable)
export const inputCloudBtn = {};

export const placeHolderInput = ['Text mit Diagnosen...'];

// Define response format
export const Step = z.object({
    explanation: z.string(),
    output: z.string(),
});

export const ResponseFormat = z.object({
    names: z.array(z.string()).describe("An array containing the name of diagnosis."),
});

export const OpenAIResponseFormat = {
    type: "json_schema",
    json_schema: {
        name: "diagnosis_names",
        schema: {
            type: "object",
            required: ["diagnosis"],
            properties: {
                diagnosis: { // same as required mostly
                    type: "array",
                    items: {
                        type: "string",
                        description: "The name of a diagnosis."
                    },
                    description: "An array containing the name of diagnosis."
                }
            },
            additionalProperties: false
        },
        strict: true
    }
};

export { examplesData, rawInitialMessages };
