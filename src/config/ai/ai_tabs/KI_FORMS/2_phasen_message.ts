import { z } from "zod";
import examplesData from '../../sidebar_examples/chdt_sidebar_config.json';
import rawInitialMessages from '../../ai_forms/ki_formulare_2_phasen_entity.json';

export const warning_msg = 'Closed-Beta Test: WhatsApp Style / Mundart / Freiform eingeben ➜ Schriftdeutsch erhalten';

export const followupBtn = ['kuerzer schreiben', 'als Memo für den Chef schreiben', 'als E-Mail schreiben'];

// Cloud buttons (if applicable)
export const inputCloudBtn = {};

export const placeHolderInput = ['Text mit Entitäten...'];

// Define response format
export const Step = z.object({
    explanation: z.string(),
    output: z.string(),
});

export const ResponseFormat = z.object({
    names: z.array(z.string()).describe("An array containing the names of people."),
});

export const OpenAIResponseFormat = {
    type: "json_schema",
    json_schema: {
        name: "people_names",
        schema: {
            type: "object",
            required: ["names"],
            properties: {
                names: {
                    type: "array",
                    items: {
                        type: "string",
                        description: "The name of a person."
                    },
                    description: "An array containing the names of people."
                }
            },
            additionalProperties: false
        },
        strict: true
    }
};

export { examplesData, rawInitialMessages };
