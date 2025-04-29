// File: app/utils/useFileLogger.tsx

import React, { useState, useEffect, ChangeEvent } from 'react';
import { openDB } from 'idb';

// Extend FileSystemFileHandle with permission methods
interface FSHandleWithPermissions extends FileSystemFileHandle {
    queryPermission(opts?: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
    requestPermission(opts?: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
}

type MaybeHandle = FSHandleWithPermissions | undefined;

const DB_NAME = 'file-logger-db';
const STORE_NAME = 'handles';

// Open (or create) our IndexedDB to persist the file handle
async function openHandleDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        }
    });
}

async function getStoredHandle(): Promise<MaybeHandle> {
    const db = await openHandleDB();
    return db.get(STORE_NAME, 'logFile') as Promise<MaybeHandle>;
}

async function storeHandle(handle: FileSystemFileHandle): Promise<void> {
    const db = await openHandleDB();
    await db.put(STORE_NAME, handle, 'logFile');
}

// Hook: once-per-app-pick prompt, then persistent handle
export function useFileLogger(maxBytes: number = 25 * 1024 * 1024) {
    const [fileHandle, setFileHandle] = useState<FSHandleWithPermissions | null>(null);
    const [error, setError] = useState<string | null>(null);
    const initRef = React.useRef(false);

    useEffect(() => {
        (async () => {
            if (initRef.current) return;
            initRef.current = true;

            try {
                // Try to load existing handle
                let handle = await getStoredHandle();

                if (handle) {
                    // Ensure permission is still OK
                    let perm = await handle.queryPermission({ mode: 'readwrite' });
                    if (perm === 'prompt') perm = await handle.requestPermission({ mode: 'readwrite' });
                    if (perm !== 'granted') {
                        setError('Schreibberechtigung verweigert');
                        return;
                    }
                    setFileHandle(handle);
                    return;
                }

                // No handle stored → prompt user once, with timestamped name
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const suggestedName = `transcription_log_${timestamp}.txt`;

                const newHandle = await (window as any).showSaveFilePicker({
                    suggestedName,
                    types: [
                        { description: 'Text Files', accept: { 'text/plain': ['.txt'] } }
                    ]
                }) as FSHandleWithPermissions;

                // Validate size
                const file = await newHandle.getFile();
                if (file.size > maxBytes) {
                    setError(`Datei überschreitet Limit (${(maxBytes / (1024 * 1024)).toFixed(1)} MB)`);
                    return;
                }

                // Ensure write permission
                let perm = await newHandle.queryPermission({ mode: 'readwrite' });
                if (perm === 'prompt') perm = await newHandle.requestPermission({ mode: 'readwrite' });
                if (perm !== 'granted') {
                    setError('Schreibberechtigung verweigert');
                    return;
                }

                // Persist handle and set state
                await storeHandle(newHandle);
                setFileHandle(newHandle);
            } catch (e: any) {
                if (e.name !== 'AbortError') {
                    setError(e.message || 'Fehler beim Initialisieren');
                }
            }
        })();
    }, [maxBytes]);

    // Overwrite file with the full text on each call
    const writeFull = async (text: string) => {
        if (!fileHandle) return;
        try {
            const writable = await fileHandle.createWritable();
            await writable.write(text);
            await writable.close();
        } catch (e: any) {
            setError(e.message || 'Fehler beim Schreiben der Datei');
        }
    };

    return { writeFull, error, ready: !!fileHandle };
}

// Component: sync entire textarea to file in real time
export default function FileLogger() {
    const { writeFull, error, ready } = useFileLogger();
    const [value, setValue] = useState('');

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value;
        setValue(newVal);
        writeFull(newVal);
    };

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
