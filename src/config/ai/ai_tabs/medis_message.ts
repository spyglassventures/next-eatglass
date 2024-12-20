// next-kappelihof/src/config/ai/ai_tabs/ernaehrung_message.ts
import examplesData from '../sidebar_examples/medis_sidebar_config.json';
import rawInitialMessages from '../ai_context/medis_message.json';

export const warning_msg = 'Closed-Beta Test: Medikament (optional: + Kontext) ➜ Infos zur Unverträglichkeiten/Nebenwirkungen.';

export const followupBtn = ['mehr Argumente', 'eloquenter formulieren', 'übersetze in Hindi'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}
export const placeHolderInput = ['Mediname und Umstand eingeben...'];

export { examplesData, rawInitialMessages };
