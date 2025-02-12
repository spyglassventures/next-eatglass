// /src/config/ai/ai_tabs/freitext_message.ts
import examplesData from '../sidebar_examples/bd_24_sidebar_config.json';
import rawInitialMessages from '../ai_context/bd_24_message.json';

export const warning_msg = 'Closed-Beta Test: Eingeben was Sie möchten';

export const followupBtn = ['anders', 'ausfuehrlicher', 'etwas kreativer'];// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}

export const placeHolderInput = ['w, 65J, Hypertonie, Kopfschmerzen morgens, keine Medis, Tagesmittelwert 145/90 mmHg, Nachtmittelwert 130/85 mmHg, fehlender nächtlicher Abfall („Non-Dipper“), Puls 78 bpm'];

export { examplesData, rawInitialMessages };
