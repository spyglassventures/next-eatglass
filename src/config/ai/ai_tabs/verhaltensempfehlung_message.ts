// next-kappelihof/src/config/ai/ai_tabs/mediausland_message.ts
import examplesData from '../sidebar_examples/verhaltensempfehlung_sidebar_config.json';
import rawInitialMessages from '../ai_context/verhaltensempfehlung_message.json';

export const warning_msg = 'Closed-Beta Test: Verletzung oder Beschwerden nennen ➜ Verhaltensempfehlung erhalten';

export const followupBtn = ['anderer Kontext', 'mehr Empfehlungen', 'in Französisch'];
// if in existence, then the cloud buttons will be displayed. Otherwise the request to enter the prompt will be displayed.
export const inputCloudBtn = {
    // Heading_1: [
    //     "Option 1",
    //     "Option 2",
    // ],
}
export const placeHolderInput = ['Umstände, Details eingeben...'];

export { examplesData, rawInitialMessages };
