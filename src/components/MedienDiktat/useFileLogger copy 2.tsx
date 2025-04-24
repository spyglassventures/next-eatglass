// File: app/utils/useFileLogger.tsx

import React, { useState, useEffect, ChangeEvent } from 'react';
import { openDB } from 'idb';

// Extend FileSystemFileHandle with permission methods
interface FSHandleWithPermissions extends FileSystemFileHandle {
    queryPermission(opts?: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
    requestPermission(opts?: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
}

// IndexedDB store key
const DB_NAME = 'file-logger-db';
const DIR_STORE = 'dirHandle';

// Open (or create) the IndexedDB for directory handle storage
async function openHandleDB() {
    return openDB(DB_NAME, 2, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(DIR_STORE)) {
                db.createObjectStore(DIR_STORE);
            }
        }
    });
}

// Retrieve stored directory handle
async function getDirectoryHandle(): Promise<FileSystemDirectoryHandle | undefined> {
    const db = await openHandleDB();
    return db.get(DIR_STORE, 'directory');
}

// Store directory handle
async function storeDirectoryHandle(handle: FileSystemDirectoryHandle) {
    const db = await openHandleDB();
    await db.put(DIR_STORE, handle, 'directory');
}

// Hook: prompt once for directory, maintain a live log.txt, snapshot on unload/unmount
export function useFileLogger(maxBytes: number = 25 * 1024 * 1024) {
    const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
    const [fileHandle, setFileHandle] = useState<FSHandleWithPermissions | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Initialize directory and working log file
    useEffect(() => {
        (async () => {
            try {
                let directory = await getDirectoryHandle();
                if (!directory) {
                    directory = await (window as any).showDirectoryPicker();
                    if (!directory) {
                        setError('Kein Verzeichnis ausgewählt');
                        return;
                    }
                    await storeDirectoryHandle(directory);
                }
                setDirHandle(directory);

                const handle = (await directory.getFileHandle('log.txt', { create: true })) as FSHandleWithPermissions;
                let perm = await handle.queryPermission({ mode: 'readwrite' });
                if (perm === 'prompt') perm = await handle.requestPermission({ mode: 'readwrite' });
                if (perm !== 'granted') {
                    setError('Schreibberechtigung verweigert');
                    return;
                }
                setFileHandle(handle);
            } catch (e: any) {
                if (e.name !== 'AbortError') setError(e.message || 'Fehler beim Initialisieren');
            }
        })();
    }, [maxBytes]);

    // Overwrite log.txt with full text
    const writeFull = async (text: string) => {
        if (!fileHandle) return;
        try {
            const writable = await fileHandle.createWritable({ keepExistingData: false });
            await writable.write(text);
            await writable.close();
        } catch (e: any) {
            setError(e.message || 'Fehler beim Schreiben');
        }
    };

    // Snapshot: read full content from log.txt, write to timestamped file, then clear log.txt
    const snapshot = async () => {
        if (!dirHandle || !fileHandle) return;
        try {
            // Read current log.txt content
            const logFile = await fileHandle.getFile();
            const content = await logFile.text();

            // Create timestamped snapshot
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const name = `transcription_log_${timestamp}.txt`;
            const snapHandle = (await dirHandle.getFileHandle(name, { create: true })) as FSHandleWithPermissions;

            // Write full content to snapshot
            let writable = await snapHandle.createWritable({ keepExistingData: false });
            await writable.write(content);
            await writable.close();

            // Clear log.txt
            writable = await fileHandle.createWritable({ keepExistingData: false });
            await writable.write('');
            await writable.close();
        } catch (e: any) {
            console.error('Snapshot error', e);
        }
    };

    return { writeFull, snapshot, error, ready: !!fileHandle };
}

// Component: sync textarea and snapshot on unmount or page unload
export default function FileLogger() {
    const { writeFull, snapshot, error, ready } = useFileLogger();
    const [value, setValue] = useState('');
    const valueRef = useRef<string>('');

    // Write on each change
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value;
        setValue(newVal);
        valueRef.current = newVal;
        writeFull(newVal);
    };

    // Snapshot on component unmount
    useEffect(() => {
        return () => {
            snapshot();
        };
    }, [snapshot]);

    // Snapshot on page unload
    useEffect(() => {
        const onUnload = () => snapshot();
        window.addEventListener('beforeunload', onUnload);
        return () => window.removeEventListener('beforeunload', onUnload);
    }, [snapshot]);

    return (
        <div className="p-4 bg-white rounded shadow-md">
            <textarea
                className="w-full p-2 border rounded"
                rows={6}
                placeholder={
                    ready
                        ? 'Text eingeben – wird in Echtzeit gespeichert'
                        : 'Log-Datei wird vorbereitet...'
                }
                value={value}
                onChange={handleChange}
                disabled={!ready}
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}