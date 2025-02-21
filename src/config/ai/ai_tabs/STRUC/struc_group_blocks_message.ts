
// struc_diagnosen_extract_message.ts
import { z } from "zod";
import examplesData from '../../sidebar_examples/STRUC/extract_diagnose_sidebar_config.json';
import rawInitialMessages from '../../ai_forms/STRUC/ki_formulare_diagnosen.json';

export const warning_msg = 'Closed-Beta Test: WhatsApp Style / Mundart / Freiform eingeben ➜ Schriftdeutsch erhalten';

export const followupBtn = ['kuerzer schreiben', 'als Memo für den Chef schreiben', 'als E-Mail schreiben'];

// Cloud buttons (if applicable)
export const inputCloudBtn = {};

export const placeHolderInput = ['Text mit unterschiedlichen Verlaufseinträgen (ohne Patientendaten)'];

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
        name: "grouped_unstructured_text",
        strict: true,
        schema: {
            type: "object",
            required: ["items"],
            properties: {
                items: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["title", "text", "related_to_theme"],
                        properties: {
                            title: {
                                type: "string",
                                description: "The title assigned to the object that summarizes what the object is about."
                            },
                            text: {
                                type: "string",
                                description: "The full text content of the object. **Do not shorten or summarize; include all details exactly as provided.**"
                            },
                            related_to_theme: {
                                type: "boolean",
                                description: "Indicates if the object is related to a bigger theme."
                            }
                        },
                        additionalProperties: false
                    },
                    description: "A collection of objects representing the grouped unstructured texts."
                }
            },
            additionalProperties: false
        }
    }
};


export { examplesData, rawInitialMessages };
