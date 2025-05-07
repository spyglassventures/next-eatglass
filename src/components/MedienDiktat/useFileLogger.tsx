// File: app/utils/useFileLogger.tsx

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { openDB } from 'idb';


export const logging_turned_on = false; // Toggle this to false to fully disable logging


// Extend FileSystemFileHandle with permission methods
interface FSHandleWithPermissions extends FileSystemFileHandle {
    queryPermission(opts?: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
    requestPermission(opts?: { mode: 'read' | 'readwrite' }): Promise<PermissionState>;
}

// IndexedDB store key
const DB_NAME = 'file-logger-db';
const DIR_STORE = 'dirHandle';

async function openHandleDB() {
    return openDB(DB_NAME, 2, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(DIR_STORE)) {
                db.createObjectStore(DIR_STORE);
            }
        }
    });
}

async function getDirectoryHandle(): Promise<FileSystemDirectoryHandle | undefined> {
    const db = await openHandleDB();
    return db.get(DIR_STORE, 'directory');
}

async function storeDirectoryHandle(handle: FileSystemDirectoryHandle) {
    const db = await openHandleDB();
    await db.put(DIR_STORE, handle, 'directory');
}

// Hook: manage live log.txt and persistent timestamp file with header
export function useFileLogger(maxBytes: number = 25 * 1024 * 1024) {
    const [dirHandle, setDirHandle] = useState<FileSystemDirectoryHandle | null>(null);
    const [logHandle, setLogHandle] = useState<FSHandleWithPermissions | null>(null);
    const [tsHandle, setTsHandle] = useState<FSHandleWithPermissions | null>(null);
    const [error, setError] = useState<string | null>(null);
    const headerRef = useRef<string>('');

    useEffect(() => {
        if (!logging_turned_on) return;

        (async () => {
            try {
                let directory = await getDirectoryHandle();
                if (!directory) {
                    directory = await (window as any).showDirectoryPicker();
                    if (!directory) throw new Error('Kein Verzeichnis ausgewählt');
                    await storeDirectoryHandle(directory);
                }
                setDirHandle(directory);

                const log = (await directory.getFileHandle('log.txt', { create: true })) as FSHandleWithPermissions;
                let perm = await log.queryPermission({ mode: 'readwrite' });
                if (perm === 'prompt') perm = await log.requestPermission({ mode: 'readwrite' });
                if (perm !== 'granted') throw new Error('Schreibberechtigung verweigert');
                setLogHandle(log);

                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const tsName = `transcription_log_${timestamp}.txt`;
                const ts = (await directory.getFileHandle(tsName, { create: true })) as FSHandleWithPermissions;
                perm = await ts.queryPermission({ mode: 'readwrite' });
                if (perm === 'prompt') perm = await ts.requestPermission({ mode: 'readwrite' });
                if (perm !== 'granted') throw new Error('Schreibberechtigung verweigert');
                setTsHandle(ts);

                const systemInfo = navigator.userAgent;
                const humanTime = new Date().toLocaleString();
                headerRef.current = [
                    '-----',
                    `System: ${systemInfo}`,
                    `Start:  ${humanTime}`,
                    '-----',
                    ''
                ].join('\n');
            } catch (e: any) {
                if (e.name !== 'AbortError') setError(e.message);
            }
        })();
    }, [maxBytes]);

    const writeAll = async (text: string) => {
        if (!logging_turned_on || !logHandle || !tsHandle) return;
        try {
            const w1 = await logHandle.createWritable({ keepExistingData: false });
            await w1.write(text);
            await w1.close();

            const w2 = await tsHandle.createWritable({ keepExistingData: false });
            await w2.write(headerRef.current + text);
            await w2.close();
        } catch (e: any) {
            setError(e.message || 'Fehler beim Schreiben');
        }
    };

    const clearLog = async () => {
        if (!logging_turned_on || !logHandle) return;
        try {
            const w = await logHandle.createWritable({ keepExistingData: false });
            await w.write('');
            await w.close();
        } catch (e: any) {
            console.error('Clear log error', e);
        }
    };

    return { writeAll, clearLog, error, ready: logging_turned_on && !!logHandle && !!tsHandle };
}


// Component: sync textarea, clear log after inactivity
export default function FileLogger() {
    // ✅ Always call hooks, even if logging is turned off
    const { writeAll, clearLog, error, ready } = useFileLogger();
    const [value, setValue] = useState('');
    const timerRef = useRef<number>();

    if (!logging_turned_on) return null;

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setValue(text);
        writeAll(text);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            clearLog();
        }, 3000);
    };

    return (
        <div className="p-4 bg-white rounded shadow-md">
            <textarea
                className="w-full p-2 border rounded"
                rows={6}
                placeholder={
                    ready
                        ? 'Text eingeben – wird in Echtzeit und ins Archiv geschrieben'
                        : 'Dateien werden vorbereitet...'
                }
                value={value}
                onChange={handleChange}
                disabled={!ready}
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}