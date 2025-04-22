// File: components/MedienDiktat/OriginalTranscriptionDisplay.tsx
import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Quill from 'quill';

// Dynamically import ReactQuill to avoid SSR issues and cast to any for TS
const ReactQuillImport = dynamic(() => import('react-quill'), { ssr: false });
const ReactQuill: any = ReactQuillImport;
import 'react-quill/dist/quill.snow.css';

// Disable toolbar entirely
const quillModules = { toolbar: false };
// Enable only bold formatting
const quillFormats: string[] = ['bold'];
// Regex to identify section headings
const headingRegex = /^(Aktuelles Problem|Befunde|Bewertung und Therapie|Prozedere)/;

// Escape HTML special chars
function escapeHtml(str: string) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

interface Props {
    value: string;
    onChange: (value: string) => void;
    onDownload: () => void;
    primaryColor: string;
    readOnly?: boolean;
}

const OriginalTranscriptionDisplay: React.FC<Props> = ({
    value,
    onChange,
    onDownload,
    primaryColor,
    readOnly = false,
}) => {
    const quillRef = useRef<any>(null);

    // Convert plain value to HTML with bolded headings
    const htmlFromText = (txt: string) =>
        txt
            .split('\n')
            .map(line => {
                const safe = escapeHtml(line);
                return headingRegex.test(line) ? `<strong>${safe}</strong>` : safe;
            })
            .join('<br/>');

    // On mount or when `value` prop changes externally, load into editor
    useEffect(() => {
        const quill = quillRef.current?.getEditor?.();
        if (quill) {
            const html = htmlFromText(value);
            quill.clipboard.dangerouslyPasteHTML(html);
            // apply bold formatting on headings
            const Block = Quill.import('blots/block');
            quill.scroll.descendants(Block, (block: any) => {
                const text = block.domNode.innerText;
                const idx = quill.getIndex(block);
                quill.formatText(idx, text.length, 'bold', headingRegex.test(text));
            });
        }
    }, [value]);

    // Handle user edits
    const handleChange = (_html: string, _delta: any, _src: any, editor: any) => {
        const quill = quillRef.current?.getEditor?.();
        const sel = quill?.getSelection();
        const plain = editor.getText().trimEnd();
        onChange(plain);
        if (quill) {
            const Block = Quill.import('blots/block');
            quill.scroll.descendants(Block, (block: any) => {
                const text = block.domNode.innerText;
                const idx = quill.getIndex(block);
                quill.formatText(idx, text.length, 'bold', headingRegex.test(text));
            });
            if (sel) quill.setSelection(sel.index, sel.length, 'silent');
        }
    };

    // Copy to clipboard
    const handleCopy = () => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(value);
        } else {
            const ta = document.createElement('textarea');
            ta.value = value;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
    };

    return (
        <div className="w-full md:w-1/2 p-3 border rounded bg-gray-50 flex flex-col">
            <h2 className="font-bold text-md mb-2" style={{ color: primaryColor }}>
                Transkription (Aufnahme)
            </h2>
            <div className="flex-1 mb-3">
                <ReactQuill
                    ref={quillRef}
                    defaultValue={htmlFromText(value)}
                    onChange={handleChange}
                    modules={quillModules}
                    formats={quillFormats}
                    theme="snow"
                    readOnly={readOnly}
                />
            </div>
            <div className="flex space-x-2">
                <button
                    onClick={handleCopy}
                    className="inline-flex items-center border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out"
                    title="Text in die Zwischenablage kopieren"
                >
                    Kopieren
                </button>
                <button
                    onClick={onDownload}
                    className="inline-flex items-center border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out"
                    title="Original-Transkription als Word-Datei herunterladen"
                >
                    <div className="relative mr-1.5 h-4 w-4">
                        <Image
                            src="/images/brands/Microsoft-Word-Icon-PNG.png"
                            alt="Word Icon"
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    Original als Word
                </button>
            </div>
        </div>
    );
};

export default OriginalTranscriptionDisplay;