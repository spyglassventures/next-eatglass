// next-kappelihof/src/config/ai/ai_tabs/verordnung_message.ts
import examplesData from '../sidebar_examples/verordnung_sidebar_config.json';
import rawInitialMessages from '../ai_context/verordnung_message.json';

export const warning_msg = 'Closed-Beta Test: Patientenkontext und Verordnung nennen ➜ Verordnung erhalten';

export const followupBtn = ['mehr Argument', 'formaler', 'in Französisch'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}
export const placeHolderInput = ['Verordnungswunsch, Details eingeben...'];

export { examplesData, rawInitialMessages };
