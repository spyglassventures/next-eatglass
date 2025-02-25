// next-kappelihof/src/config/ai/ai_tabs/ernaehrung_message.ts
import examplesData from '../sidebar_examples/ncp_diagnose_sidebar_config.json'
import rawInitialMessages from '../ai_context/ncp_diagnose_message.json'
export const warning_msg = 'Closed-Beta Test: Ernährungsbedürfnisse ➜ Ernährungsempfehlung erhalten';

export const followupBtn = ['vegane Gerichte', 'Fleisch Gerichte', 'vegetarische Gerichte'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}

export const placeHolderInput = ['Ernährungskontext eingeben...'];



export { examplesData, rawInitialMessages };