'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { favoriteZiffern } from './favoriteZiffern';


import TardocOverview from './TardocOverview';
import TardocTranscription from './TardocTranscription';

interface TarmedItem {
    Ziffer: string;
    Text: string;
}

type View = 'overview' | 'transcription' | 'suche';

const favoriteZiffernLabeled = [
    { label: 'Grundversorgung, Beratung, Berichte', key: 'grundversorgung' },
    { label: 'Untersuchungen', key: 'untersuchungen' },
    { label: 'Diagnostik', key: 'diagnostik' },
    { label: 'Röntgen', key: 'roentgen' },
    { label: 'Berichte', key: 'berichte' },
    { label: 'Wundversorgung', key: 'wundversorgung' },
    { label: 'Sonstiges', key: 'sonstiges' },
];




const Tardoc = () => {
    const [activeView, setActiveView] = useState<View>('overview');
    const [tarmedList, setTarmedList] = useState<TarmedItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/data/tarmed109.csv');
            const text = await res.text();
            Papa.parse<TarmedItem>(text, {
                header: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const cleaned = result.data.map(row => ({
                        Ziffer: row.Ziffer?.trim(),
                        Text: row.Text?.trim(),
                    })).filter(row => row.Ziffer && row.Text);
                    setTarmedList(cleaned);
                },
            });
        };
        fetchData();
    }, []);

    const normalize = (str: string) => str.replace(/\./g, '').toLowerCase();

    const filteredDropdown = tarmedList.filter(item =>
        normalize(item.Ziffer).includes(normalize(searchTerm)) ||
        item.Text.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);

    const handleAdd = (ziffer: string) => {
        setSelectedItems(prev => ({
            ...prev,
            [ziffer]: (prev[ziffer] || 0) + 1,
        }));
        setSearchTerm('');
        setDropdownVisible(false);
    };

    const [showOtmaHint, setShowOtmaHint] = useState(false);

    const handleRemove = (ziffer: string) => {
        setSelectedItems(prev => {
            const updated = { ...prev };
            if (updated[ziffer] > 1) {
                updated[ziffer] -= 1;
            } else {
                delete updated[ziffer];
            }
            return updated;
        });
    };

    const handleClear = () => setSelectedItems({});
    const handleExport = () => {
        const csvHeader = 'TARMED;VOLUME\n';
        const csvRows = Object.entries(selectedItems)
            .map(([ziffer, count]) => `${ziffer};${count}`)
            .join('\n');

        const csvContent = csvHeader + csvRows;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tarmed_volumes.csv';
        a.click();
        setShowOtmaHint(true);
    };


    const getItemByZiffer = (ziffer: string) =>
        tarmedList.find(item => item.Ziffer === ziffer);

    return (
        <div className="min-h-screen bg-gradient-to-r from-secondary to-indigo-100 dark:from-gray-800 dark:to-gray-900 text-sm text-black dark:text-white">
            {/* NAVIGATION */}
            <nav className="bg-white dark:bg-gray-900 shadow p-4 mb-4 flex flex-wrap justify-between items-center text-sm">
                <div className="text-indigo-700 font-semibold">TARMED Tool</div>
                <div className="space-x-3 mt-2 md:mt-0">
                    <button onClick={() => setActiveView('overview')} className="text-indigo-600 hover:underline">1. Übersicht</button>

                    <button onClick={() => setActiveView('suche')} className="text-indigo-600 hover:underline">2. Tarmed Erfassen</button>

                    <a
                        href="https://tarifmatcher.oaat-otma.ch/transcode?locale=de"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline"
                    >
                        3. Tarifmatcher
                    </a>
                    <button
  onClick={() => {
    setActiveView('transcription');
   
  }}
  className="text-indigo-600 hover:underline"
>
  4. Auswertung
</button>

                </div>
            </nav>
            



            {/* DYNAMISCHER INHALT */}
            <div className="container mx-auto px-4 lg:px-24 pb-16">
            {activeView === 'overview' && <TardocOverview onContinue={() => setActiveView('suche')} />}



                {activeView === 'transcription' && <TardocTranscription />}


                {activeView === 'suche' && (
  <div className="flex flex-col md:flex-row gap-6">
    {/* Linke Seite: Favoriten-Buttons */}
    <div className="md:w-1/2">
      <h3 className="text-xs text-indigo-800 dark:text-indigo-200 mb-1 font-semibold uppercase">
        Schnellerfassung Grundversorger
      </h3>
      <p className="text-xs text-gray-500 mb-3">
        Wähle häufig verwendete Positionen per Klick aus.
      </p>

      <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
        {favoriteZiffernLabeled.map(section => (
          <div key={section.key} className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {section.label}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {favoriteZiffern[section.key].map(z => {
                const item = getItemByZiffer(z);
                if (!item) return null;

                const shortText =
                  item.Text.length > 50
                    ? item.Text.slice(0, 46).trim() + '...'
                    : item.Text;

                return (
                  <button
                    key={z}
                    onClick={() => handleAdd(z)}
                    className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs text-left leading-tight h-[50px] flex flex-col justify-center"
                  >
                    <strong>{item.Ziffer}</strong>
                    <span className="block truncate text-xs">{shortText}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Rechte Seite: Auswahl, Suchfeld, vollständige Liste */}
<div className="md:w-1/2 space-y-6">

{/* Ausgewählte Ziffern */}
<div>
  <h4 className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
    Ausgewählte Ziffern
  </h4>
  {Object.keys(selectedItems).length === 0 ? (
    <p className="text-gray-400 text-xs">Noch keine Positionen erfasst</p>
  ) : (
    <ul className="text-left mb-2 max-h-60 overflow-y-auto pr-2 text-xs border rounded p-2 bg-white dark:bg-gray-800">
      {Object.entries(selectedItems).map(([ziffer, count]) => {
        const item = getItemByZiffer(ziffer);
        return item ? (
          <li key={ziffer} className="flex justify-between items-start py-1 border-b">
            <div>
              <strong>{item.Ziffer}</strong> x{count}
              <div className="text-gray-600 dark:text-gray-400">{item.Text}</div>
            </div>
            <button
              onClick={() => handleRemove(ziffer)}
              className="text-red-500 hover:text-red-700"
            >
              Entfernen
            </button>
          </li>
        ) : null;
      })}
    </ul>
  )}
  {Object.keys(selectedItems).length > 0 && (
    <div className="space-x-2 mt-2">
      <button onClick={handleClear} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs">
        Alle löschen
      </button>
      <button onClick={handleExport} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs">
        Exportieren
      </button>
      {showOtmaHint && (
 <div className="mt-4 p-4 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 text-sm rounded w-full">
 <strong>Sehr gut.</strong> Wechseln Sie nun zur{' '}
 <a
   href="https://tarifmatcher.oaat-otma.ch/transcode?locale=de"
   target="_blank"
   rel="noopener noreferrer"
   className="underline font-semibold"
 >
   otma Webseite (Tarifmatcher)
 </a>
 . Laden Sie dort die gerade exportierte CSV hoch und klicken Sie auf „Transkodieren und Download“. Kommen Sie danach zu „4. Auswertung“ zurück.
</div>

)}

    </div>
    
  )}
</div>

{/* Suchfeld darunter */}
<div className="relative">
  <input
    type="text"
    value={searchTerm}
    onChange={e => {
      setSearchTerm(e.target.value);
      setDropdownVisible(true);
    }}
    placeholder="Nach Ziffer oder Text suchen..."
    className="w-full px-3 py-2 border rounded-lg text-sm text-black"
  />
  {dropdownVisible && searchTerm.length > 0 && (
    <ul className="absolute w-full bg-white dark:bg-gray-700 border mt-1 rounded shadow max-h-40 overflow-y-auto text-left text-sm z-10">
      {filteredDropdown.map(item => (
        <li
          key={item.Ziffer}
          className="px-3 py-1 hover:bg-indigo-100 dark:hover:bg-indigo-600 cursor-pointer"
          onClick={() => handleAdd(item.Ziffer)}
        >
          <strong>{item.Ziffer}</strong> – {item.Text}
        </li>
      ))}
      {filteredDropdown.length === 0 && (
        <li className="px-4 py-2 text-gray-500">Keine Treffer</li>
      )}
    </ul>
  )}
</div>

{/* Vollständige Liste */}
<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow max-h-[40vh] overflow-y-auto text-xs">
  <h3 className="text-xs text-indigo-800 dark:text-indigo-200 mb-1 font-semibold uppercase">Tarmed 1.09</h3>
  <p className="text-xs text-gray-500 mb-3">
    Vollständige Liste aller TARMED-Ziffern. Klick fügt Position zur Auswahl hinzu.
  </p>
  <ul className="space-y-1">
    {tarmedList.map(item => (
      <li
        key={item.Ziffer}
        className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-700 p-2 rounded"
        onClick={() => handleAdd(item.Ziffer)}
      >
        <strong>{item.Ziffer}</strong> – {item.Text}
      </li>
    ))}
  </ul>
</div>
</div>

  </div>
)}

            </div>
        </div>
    );
};

export default Tardoc;
