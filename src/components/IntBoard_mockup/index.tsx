import React from 'react';
// Importing DocumentIcon if you plan to use it in the future
// import { DocumentIcon } from '@heroicons/react/24/solid';

// adjust in src/config/ai/components.js: import Translate from '@/components/Translate'; and fix buttons, icon, etc..
// { key: 'Translate', name: 'Translate', visible: true },
// ExclamationTriangleIcon,           // Import for Lieferengpass
// import Translate from '@/components/IntTranslate'; //
// case 'Translate':
//             return Translate;

import BulletinBoard from "@/components/IntBoard/BulletinBoard";

export default function IntBoard() {
    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            <div className="bg-slate-50 p-4 rounded-lg">
                <h1 className="text-lg font-bold mb-4">Hier wird in Kürze ein schwarzes Brett zu finden sein.</h1>
                <BulletinBoard />
            </div>
        </div>
    );
}


