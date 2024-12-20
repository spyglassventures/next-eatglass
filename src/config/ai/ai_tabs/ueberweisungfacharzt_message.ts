// next-kappelihof/src/config/ai/ai_tabs/ueberweisungfacharzt_message.ts
import examplesData from '../sidebar_examples/ueberweisungfacharzt_sidebar_config.json';
import rawInitialMessages from '../ai_context/ueberweisungfacharzt_message.json';

export const warning_msg = 'Closed-Beta Test: Patientenkontext ➜ Überweisung erhalten';

export const followupBtn = ['alternativ formulieren', 'formaler', 'ergänze mit Beispielen'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}
export const placeHolderInput = ['Facharztbereich, Diagnosevermutung, Medis, Umstände, Fristigkeit'];

export { examplesData, rawInitialMessages };
