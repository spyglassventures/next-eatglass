// next-kappelihof/src/config/ai/ai_tabs/ernaehrung_message.ts
import examplesData from '../sidebar_examples/antwortmail_split_sidebar_config.json';
import rawInitialMessages from '../ai_context/antwortmail_split_message.json';

export const warning_msg = 'Closed-Beta Test: Fragekatalog und Kontext zur Beantwortung eingeben ➜ Beantwortete Fragen erhalten';

export const followupBtn = ['Details erklären', 'neu schreiben', 'Fragen detailliert beantworten bitte'];

// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}

export const placeHolderInput = ['Fragen und Kontext reinkopieren...'];

export { examplesData, rawInitialMessages };
