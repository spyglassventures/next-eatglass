'use client';

import React, { useState, useEffect } from 'react';

const tabs = [
    { name: 'Vitodata', available: true },
    { name: 'Aeskulap', available: false },
    { name: 'Achilles', available: false },
    { name: 'Pex', available: false },
    { name: 'Andere', available: false },
];

type SystemTabsProps = {
    onSystemChange: (name: string, available: boolean) => void;
};

const SystemTabs = ({ onSystemChange }: SystemTabsProps) => {
    const [selectedTab, setSelectedTab] = useState(tabs[0].name);

    useEffect(() => {
        const current = tabs.find(t => t.name === selectedTab);
        if (current) onSystemChange(current.name, current.available);
    }, [selectedTab]);

    const current = tabs.find(t => t.name === selectedTab) ?? tabs[0];

    return (
        <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-3 mb-2">
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedTab(tab.name)}
                        className={`px-5 py-2 rounded-full font-medium transition-transform duration-300 
                            ${selectedTab === tab.name
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {!current.available && (
                <p className="text-sm text-center text-gray-700 italic">
                    Derzeit nicht verfügbar für <strong>{current.name}</strong>. Interesse?{' '}
                    <a
                        href="https://www.docdialog.ch/mailer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[var(--color-primary)]"
                    >
                        Jetzt melden
                    </a>
                </p>
            )}

            {current.name === 'Vitodata' && (
                <div className="mt-4 text-sm text-center text-gray-800 space-y-1">
                    <p>
                        <a
                            href="/data/anleitungen/Anleitung_Topseller_Medis_Migel_aus_Praxis_Informationssystem.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-[var(--color-primary)]"
                        >
                            Vitodata Anleitung: Topseller Medis/Migel exportieren - für den Upload in diesem Modul hier(PDF)
                        </a>
                    </p>
                    <p>
                        <a
                            href="/data/anleitungen/Anleitung_Stammdaten_Medis_Migel_bearbeiten_aus_Praxis_Informationssystem.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-[var(--color-primary)]"
                        >
                            Vitodata Anleitung: Stammdaten Medis/Migel bearbeiten, z.B. Fehlerkorrektur (PDF)
                        </a>
                    </p>

                </div>
            )}

        </div>
    );
};

export default SystemTabs;
