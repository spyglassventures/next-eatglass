// next-kappelihof/src/config/ai/ai_tabs/lschwieriger_patient_message.ts
import examplesData from '../sidebar_examples/schwieriger_patient_sidebar_config.json';
import rawInitialMessages from '../ai_context/schwieriger_patient_messsage.json';

export const warning_msg = 'Closed-Beta Test: Schwierige Umstände eingeben ➜ Antwortvorschlag erhalten';

export const followupBtn = ['mehr Argumente', 'höfflicher formulieren', 'übersetze in Englisch'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}
export const placeHolderInput = ['Konfliktumstände eingeben (umgangsprachlich)...'];

export { examplesData, rawInitialMessages };
