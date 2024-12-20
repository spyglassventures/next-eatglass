// /src/config/ai/ai_tabs/freitext_message.ts
import examplesData from '../sidebar_examples/stellungsnahme_sidebar_config.json';
import rawInitialMessages from '../ai_context/stellungsnahme_message.json';

export const warning_msg = 'Closed-Beta Test: Eingeben was Sie möchten';

export const followupBtn = ['anders', 'ausfuehrlicher', 'etwas kreativer'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}
export const placeHolderInput = ['Patient, chronische Rückenschmerzen, 45 J, MRT L4/5, AU länger, Gutsprache ReHa '];

export { examplesData, rawInitialMessages };
