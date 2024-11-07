// src/config/ai/imports.js
// shows which AI components are sourced into src/intern/ClientPage.tsx
// see also src/config/ai/components.js
// last changed: 6.8.24, Daniel Mueller, refactored

import Chat_diagnose from '@/components/AI/chat_diagnose';
import Chat_kostengutsprache from '@/components/AI/chat_kostengutsprache';
import Chat_ernaehrung from '@/components/AI/chat_ernaehrung';
import Chat_stellungsnahme from '@/components/AI/chat_stellungsnahme';
import Chat_documente from '@/components/AI/chat_dokumente';
import Chat_labor from '@/components/AI/chat_labor';
import Chat_literatur from '@/components/AI/chat_literatur';
import Chat_medis from '@/components/AI/chat_medis';
import Chat_summary from '@/components/AI/chat_summary';
import Chat_calculator from '@/components/AI/chat_calculator';
import Chat_plaene from '@/components/AI/chat_plaene';
import Chat_mediausland from '@/components/AI/chat_mediausland';
import Chat_ueberweisungfacharzt from '@/components/AI/chat_ueberweisungfacharzt';
import Chat_ueberweisungfacharztV2 from '@/components/AI/chat_ueberweisungfacharztV2';
import Chat_verordnung from '@/components/AI/chat_verordnung';
import Chat_verhaltensempfehlung from '@/components/AI/chat_verhaltensempfehlung';
import Chat_news from '@/components/AI/chat_news';
import Chat_freitext from '@/components/AI/chat_freitext';
import Chat_reise from '@/components/AI/chat_reise';
import Chat_pdf from '@/components/AI/chat_pdf';
import Chat_image from '@/components/AI/chat_image';
import Chat_versicherungsanfrage from '@/components/AI/chat_versicherungsanfrage';

// Freitext
// import Chat_antwortemail from '@/components/AI/chat_antwortemail';
// import Chat_verlaufsoptimierer from '@/components/AI/chat_verlaufsoptimierer';

// Medien KI
import Chat_antwortemail from '@/components/AI/chat_antwortemail';
import Chat_verlaufsoptimierer from '@/components/AI/chat_verlaufsoptimierer';
import Chat_chdt from '@/components/AI/chat_chdt';

// KI FORMS
import Chat_KI_FORMS_AZ_Jugendliche from '@/components/AI/KI_FORMS/chat_KI_FORMS_AZ_Jugendliche';
import Chat_KI_FORMS_ktg_erstbericht from '@/components/AI/KI_FORMS/chat_KI_FORMS_ktg_erstbericht';
import chat_KI_FORMS_sva_aerztlicher_bericht_eingliederung from '@/components/AI/KI_FORMS/chat_KI_FORMS_SVA_Aerztlicher_Bericht_Eingliederung';
import Chat_KI_FORMS_sva_berufliche_integration from '@/components/AI/KI_FORMS/chat_KI_FORMS_sva_berufliche_integration';
import Chat_KI_FORMS_sva_verlaufsbericht from '@/components/AI/KI_FORMS/chat_KI_FORMS_SVA_Verlaufsbericht';
import Chat_KI_FORMS_Zwischenbericht_kvg_ktg from '@/components/AI/KI_FORMS/chat_KI_FORMS_Zwischenbericht_kvg_ktg';
import Chat_KI_FORMS_Zwischenbericht_uvg_unfall from '@/components/AI/KI_FORMS/chat_KI_FORMS_Zwischenbericht_uvg_unfall';





export default {
    Chat_diagnose,
    Chat_kostengutsprache,
    Chat_ernaehrung,
    Chat_stellungsnahme,
    Chat_documente,
    Chat_labor,
    Chat_literatur,
    Chat_medis,
    Chat_summary,
    Chat_calculator,
    Chat_plaene,
    Chat_news,
    Chat_freitext,
    Chat_reise,
    Chat_pdf,
    Chat_image,
    Chat_mediausland,
    Chat_ueberweisungfacharzt,
    Chat_ueberweisungfacharztV2,
    Chat_verordnung,
    Chat_verhaltensempfehlung,
    Chat_versicherungsanfrage,

    // KI FORMS
    Chat_KI_FORMS_AZ_Jugendliche,
    Chat_KI_FORMS_ktg_erstbericht,
    chat_KI_FORMS_sva_aerztlicher_bericht_eingliederung,
    Chat_KI_FORMS_sva_berufliche_integration,
    Chat_KI_FORMS_sva_verlaufsbericht,
    Chat_KI_FORMS_Zwischenbericht_kvg_ktg,
    Chat_KI_FORMS_Zwischenbericht_uvg_unfall,
    // END KI FORMS

    // Freitext



    // Medien KI
    Chat_chdt,
    Chat_verlaufsoptimierer,
    Chat_antwortemail



};
