// next-kappelihof/src/config/ai/ai_tabs/reise_message.ts
import examplesData from '../sidebar_examples/reise_sidebar_config.json';
import rawInitialMessages from '../ai_context/reise_message.json';

export const warning_msg = 'Closed-Beta Test: Reiseort + Vorlaufzeit ➜ Med. Reiseempfehlungen erhalten';

export const followupBtn = ['mehr Folgefragen', 'eloquenter formulieren', 'übersetze in Englisch'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}
export const placeHolderInput = ['Land, Vorlaufzeit, Umstände eingeben...'];

export { examplesData, rawInitialMessages };
