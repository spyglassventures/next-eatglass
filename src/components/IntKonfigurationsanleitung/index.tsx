import React, { useState, useEffect } from 'react';
import configData from '../../config/InternalDocuments/KonfigurationsanleitungConfigData.json';
import HighlightText from './HighlightText';
import GitHelper from './git_helper';

// Define the structure of the ConfigData interface
interface ConfigData {
    editable: string;
    example: string;
}


export default function Konfigurationsanleitung() {
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [internalFileNames, setInternalFileNames] = useState<string[]>([]);
    const [aiFileNames, setAiFileNames] = useState<string[]>([]);
    const [configEntries, setConfigEntries] = useState<{ [key: string]: ConfigData }>({});
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        // Load the config data
        setConfigEntries(configData);

        // Get files in the /src/config directory
        const context = require.context('/src/config', false, /\.(json|ts|js|tsx)$/);
        const files = context.keys().map((key) => key.replace('./', '')).filter((fileName) => !fileName.includes('/'));
        setFileNames(files);

        // Get files in the /src/config/InternalDocuments directory
        const internalContext = require.context('/src/config/InternalDocuments', false, /\.(json|ts|js|tsx)$/);
        const internalFiles = internalContext.keys().map((key) => key.replace('./', '')).filter((fileName) => !fileName.includes('/'));
        setInternalFileNames(internalFiles);

        // Get files in the /src/config/ai directory
        const aiContext = require.context('/src/config/ai', false, /\.(json|ts|js|tsx)$/);
        const aiFiles = aiContext.keys().map((key) => key.replace('./', '')).filter((fileName) => !fileName.includes('/'));
        setAiFileNames(aiFiles);
    }, []);

    const filterFiles = (files: string[]) => {
        return files.filter((fileName) =>
            fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (configEntries[fileName]?.editable.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
            (configEntries[fileName]?.example.toLowerCase().includes(searchQuery.toLowerCase()) || false)
        );
    };

    const renderTable = (title: string, files: string[]) => (
        <>
            <h2 className="text-xl font-bold mt-8 mb-4">{title}</h2>
            <table className="min-w-full bg-white border-collapse mb-6">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 w-1/3">Dateiname</th>
                        <th className="border px-4 py-2 w-1/3">Bearbeitbarer Inhalt</th>
                        <th className="border px-4 py-2 w-1/3">Beispiel</th>
                    </tr>
                </thead>
                <tbody>
                    {filterFiles(files).map((fileName, index) => {
                        const config = configEntries[fileName] || { editable: 'Nicht verfügbar', example: 'Nicht verfügbar' };
                        return (
                            <tr key={index}>
                                <td className="border px-4 py-2">
                                    <HighlightText text={fileName} query={searchQuery} />
                                </td>
                                <td className="border px-4 py-2">
                                    <HighlightText text={config.editable} query={searchQuery} />
                                </td>
                                <td className="border px-4 py-2">
                                    <HighlightText text={config.example} query={searchQuery} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );

    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Konfigurationsanleitung</h1>
                <a
                    href="https://www.github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    GitHub öffnen (Login erforderlich)
                </a>
            </div>
            <p className="mb-6">
                Diese Liste zeigt alle Dateien, die du auf der Praxiswebseite anpassen kannst. Du kannst nach Dateinamen, Inhalt oder Beispielen suchen (Suchleiste unten).
                So findest du schnell die richtige Datei im GitHub-Repository (siehe blauer Button). Melde dich bei github.com an, klicke auf „next-praxisname“ und gehe in den Ordner
                „next-praxisname/src/config“. Um eine Datei zu bearbeiten, klicke sie an und nutze das Stiftsymbol (oben rechts), um sie als Text zu ändern.
                Danach klicke auf den grünen „Commit“-Button, um die Änderungen sichtbar zu machen (das dauert 1-2 Minuten).
                Fehlerhafte Änderungen werden ignoriert. Tipps und Beispiele für häufige Fehler von Datein, die von MPAs angepasst werden, findest du am Ende der Seite
                (z.B. bei „newsLatterBoxConfig.json“, „lageplanConfig.json“ und „aboutSectionOneConfig.json“).
            </p>
            <input
                type="text"
                placeholder="Suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />
            <div className="bg-slate-50">
                {renderTable('Dateinamen im Konfigurationsordner', fileNames)}
                {renderTable('Interne Dokumente', internalFileNames)}
                {renderTable('AI Dokumente', aiFileNames)}
            </div>
            <GitHelper /> {/* Display the GitHelper component */}
        </div>
    );
}
