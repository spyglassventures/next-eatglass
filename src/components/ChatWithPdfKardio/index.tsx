import React from 'react';
// Importing DocumentIcon if you plan to use it in the future
// import { DocumentIcon } from '@heroicons/react/24/solid';

// adjust in src/config/ai/components.js: import Translate from '@/components/Translate'; and fix buttons, icon, etc..
// { key: 'Translate', name: 'Translate', visible: true },
// ExclamationTriangleIcon,           // Import for Lieferengpass
// import Translate from '@/components/IntTranslate'; //
// case 'Translate':
//             return Translate;






import PdfChat from "./PdfChat";

export default function ChatWithPdf() {
    return (
        <main>
            <PdfChat />
        </main>
    );
}