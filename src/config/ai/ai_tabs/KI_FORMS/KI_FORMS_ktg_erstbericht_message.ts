// next-kappelihof/src/config/ai/ai_tabs/ktg_erstbericht_message.ts
import examplesData from '../../sidebar_examples/forms_sidebar_config.json';
import rawInitialMessages from '../../ai_context/KI_FORMS_ktg_erstbericht_message.json';

export const warning_msg = 'Closed-Beta Test: Unstrukturierter Text aus Verlauf reinkopieren (max 10 Seiten) ➜ Formularinput erhalten';

export const followupBtn = ['Details erklären', 'andere Formel nutzen', 'nochmals rechnen bitte'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}

export const placeHolderInput = ['Hier Verlauf (ohne Patientennamen wg. Datenschutz) reinkopieren...'];

export { examplesData, rawInitialMessages };



