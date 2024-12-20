// next-kappelihof/src/config/ai/ai_tabs/labor_message.ts
import examplesData from '../sidebar_examples/labor_sidebar_config.json';
import rawInitialMessages from '../ai_context/labor_message.json';

export const warning_msg = 'Closed-Beta Test: Symptome oder Diagnosevermutung eingeben ➜ Laborvorschlag erhalten';

export const followupBtn = ['mehr Argumente', 'eloquenter formulieren', 'übersetze in Hindi'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}
export const placeHolderInput = ['Laborwert eingeben...'];

export { examplesData, rawInitialMessages };
