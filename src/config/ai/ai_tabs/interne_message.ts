// next-kappelihof/src/config/ai/ai_tabs/interne_message.ts
import examplesData from '../sidebar_examples/mediausland_sidebar_config.json'; //  ??
import rawInitialMessages from '../ai_context/mediausland_message.json'; //  ??

export const warning_msg = 'Closed-Beta Test: Ernährungsbedürfnisse ➜ Ernährungsempfehlung erhalten';

export const followupBtn = ['in Englisch', 'in Spanisch', 'in Französisch'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}

export const placeHolderInput = ['Intern'];

export { examplesData, rawInitialMessages };



// FIX TO BE INTERN