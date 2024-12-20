// next-kappelihof/src/config/ai/ai_tabs/diagnose_message.ts
import examplesData from '../sidebar_examples/diagnose_sidebar_config.json';
import rawInitialMessages from '../ai_context/diagnose_message.json';

export const warning_msg = 'Closed-Beta Test: Symptome eingeben ➜ Diagnosevorschläge und Untersuchungsideen erhalten';

export const followupBtn = ['mehr Argumente', 'eloquenter formulieren', 'übersetze in Englisch'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}
export const placeHolderInput = ['Symptome, Details, Alter, Geschlecht, Medis eingeben...'];


export { examplesData, rawInitialMessages };