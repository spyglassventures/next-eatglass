// /src/config/ai/ai_tabs/verlaufsoptimierer_message.ts
import examplesData from '../sidebar_examples/verlaufsoptimierer_sidebar_config.json';
import rawInitialMessages from '../ai_context/verlaufsoptimierer_message.json';

export const warning_msg = 'Closed-Beta Test: Verlauf in Kurzform eingeben ➜ Verlaufsvorschlag erhalten';

export const followupBtn = ['anders', 'ausfuehrlicher', 'medizinisch ueberarbeiten'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}
export const placeHolderInput = ['Test mit Patientenwerten eingeben...'];

export { examplesData, rawInitialMessages };
