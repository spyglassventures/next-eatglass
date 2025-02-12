// /src/config/ai/ai_tabs/freitext_message.ts
import examplesData from '../sidebar_examples/ekg_sidebar_config.json';
import rawInitialMessages from '../ai_context/ekg_message.json';

export const warning_msg = 'Closed-Beta Test: Eingeben was Sie möchten';

export const followupBtn = ['anders', 'ausfuehrlicher', 'etwas kreativer'];// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}

export const placeHolderInput = ['w, 65J, Hypertonie, Brustschmerzen, Schwindel, keine Medis, kein Blocker, Antiarrhythmika, EKG 25 mm/s, Verstärkung 10 mm, Sinusrhythmus, ST-Hebung V2-V4'];

export { examplesData, rawInitialMessages };
