// next-kappelihof/src/config/ai/ai_tabs/ernaehrung_message.ts
import examplesData from '../sidebar_examples/versicherungsanfrage_sidebar_config.json';
import rawInitialMessages from '../ai_context/versicherungsanfrage_message.json';

export const warning_msg = 'Closed-Beta Test: Versichungsanfrage ➜ Formularinput erhalten';

export const followupBtn = ['Details erklären', 'andere Formel nutzen', 'nochmals rechnen bitte'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}
export const placeHolderInput = ['Test mit Patientenwerten eingeben...'];

export { examplesData, rawInitialMessages };
