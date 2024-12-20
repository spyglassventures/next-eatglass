// next-kappelihof/src/config/ai/ai_tabs/ernaehrung_message.ts
import examplesData from '../sidebar_examples/calculator_sidebar_config.json';
import rawInitialMessages from '../ai_context/calculator_message.json';

export const warning_msg = 'Closed-Beta Test: wird nicht gezeigt';

export const followupBtn = ['Details erklären', 'andere Formel nutzen', 'nochmals rechnen bitte']; // not shown
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}

export const placeHolderInput = ['Frage zum Bild eingeben...']; // not shown

export { examplesData, rawInitialMessages };
