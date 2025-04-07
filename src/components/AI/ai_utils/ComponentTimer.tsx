'use client';

import { useEffect, useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComponentTimer({
    componentName = 'Unbekannte Komponente',
    mode = 'MPA',
}: {
    componentName?: string;
    mode?: string;
}) {
    const [startTime] = useState<Date>(new Date());
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
            setElapsedSeconds(diff);
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} Min.`;
    };

    const endTime = new Date(startTime.getTime() + elapsedSeconds * 1000);
    const pauschaleStart = 180;
    const pauschaleVerarbeitung = 120;
    const dynamic = elapsedSeconds;
    const total = pauschaleStart + dynamic + pauschaleVerarbeitung;
    const roundedMinutes = Math.ceil(total / 60);

    const getTardocCalculation = (totalMinutes: number) => {
        const firstBlock = Math.min(totalMinutes, 5);
        const additionalMinutes = Math.max(totalMinutes - 5, 0);
        const baseTP = 19.20;
        const additionalTP = additionalMinutes * 3.84;
        const totalTP = baseTP + additionalTP;

        return {
            firstBlock,
            additionalMinutes,
            baseTP,
            additionalTP,
            totalTP,
        };
    };

    const tardoc = getTardocCalculation(roundedMinutes);

    const handleDownload = () => {
        const lines = [
            '────────────────────────────────────────────────────────',
            '                  ZEITRAPPORT',
            '────────────────────────────────────────────────────────',
            `Datum: ${startTime.toLocaleDateString()}`,
            `Komponente: ${componentName}`,
            `Modus: ${mode}`,
            '',
            `Startzeit: ${startTime.toLocaleTimeString()}`,
            `Endzeit: ${endTime.toLocaleTimeString()}`,
            '',
            'Leistungsübersicht:',
            `✔ Applikations-Start (Pauschale)	${formatTime(pauschaleStart)}`,
            `✔ Komponentennutzung			${formatTime(dynamic)}`,
            `✔ Weiterbearbeitung (Pauschale)    	${formatTime(pauschaleVerarbeitung)}`,
            '────────────────────────────────────────────────────────',
            `Totalzeit:				${formatTime(total)}`,
            '',
            'TARDOC-Vorschlag (Leistungsziffern):',
            `✔ AA 00.0010	1x = 19.20 TP`,
            `✔ AA 00.0020	${tardoc.additionalMinutes}x = ${tardoc.additionalTP.toFixed(2)} TP`,
            `Gesamttotal:    ${tardoc.totalTP.toFixed(2)} TP`,
            '',
            'Hinweis:',
            'Gemäss den Tarifierungsgrundsätzen der nationalen Tariforganisation',
            'kann diese Zeitkomponente bei der Abrechnung unterstützend verwendet werden.',
            'Passen Sie die Pauschalen Ihren Umständen an. Plausibilisieren Sie die Zeiterfassung.',
            'Diese Datei kann dann zur Dokumentation im System hinterlegt werden.',
            'Alle Angaben ohne Gefähr. Keine Haftungsübernahme.',
            '',
            `System: ${window.location.hostname}`,
        ];

        const blob = new Blob([lines.join('\n')], {
            type: 'text/plain;charset=utf-8',
        });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `zeitrapport_${componentName}_${startTime.toISOString().split('T')[0]}.txt`;
        link.click();
    };

    return (
        <div
            className="relative"
            onMouseEnter={() => setShowModal(true)}
            onMouseLeave={() => setShowModal(false)}
        >
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1 shadow-sm text-xs text-gray-800 dark:text-gray-200">
                <div className="font-mono tracking-tight">⌛ {formatTime(total)}</div>
                <button onClick={handleDownload} title="Zeitrapport herunterladen">
                    <ArrowDownTrayIcon className="w-4 h-4 text-gray-500 hover:text-black dark:hover:text-white" />
                </button>
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 right-0 mt-2 w-80 p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-xl rounded-lg text-xs"
                    >
                        <div className="font-semibold mb-1">Zeitrapport</div>
                        <div>Gesamtzeit: {formatTime(total)}</div>
                        <div>Komponente: {componentName}</div>
                        <div>Modus: {mode}</div>
                        <div className="mt-2 font-semibold">TARDOC-Leistungsziffern:</div>
                        <ul className="list-disc list-inside">
                            <li>✔ AA 00.0010 – 1x = 19.20 TP</li>
                            <li>✔ AA 00.0020 – {tardoc.additionalMinutes}x = {tardoc.additionalTP.toFixed(2)} TP</li>
                            <li><strong>Gesamt: {tardoc.totalTP.toFixed(2)} TP</strong></li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}