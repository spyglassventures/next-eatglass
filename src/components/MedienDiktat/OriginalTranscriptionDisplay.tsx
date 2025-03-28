// File: components/MedienDiktat/OriginalTranscriptionDisplay.tsx
// File: components/MedienDiktat/OriginalTranscriptionDisplay.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const quillModules = {
    // toolbar: [
    //     [{ header: [1, 2, 3, false] }],
    //     ['bold', 'italic', 'underline', 'strike'],
    //     [{ list: 'ordered' }, { list: 'bullet' }],
    //     ['link', 'code-block'],
    //     ['clean'],
    // ],
    toolbar: false, // disable toolbar completely
};

// const quillFormats = [
//     'header',
//     'bold',
//     'italic',
//     'underline',
//     'strike',
//     'list',
//     'bullet',
//     'link',
//     'code-block',
// ];

const quillFormats: string[] = [];

interface Props {
    // Remove this line:
    // transcription: string | null;

    // Add this line:
    value: string; // Current value for the editor

    // Add this line:
    onChange: (value: string) => void; // Function to call when editor content changes

    onDownload: () => void;
    primaryColor: string;
    readOnly?: boolean; // Keep if you added this previously
}

const OriginalTranscriptionDisplay: React.FC<Props> = ({
    value,
    onChange,

    onDownload,
    primaryColor,
    readOnly = false,
}) => {


    return (
        <div className="w-full md:w-1/2 p-3 border rounded bg-gray-50 overflow-auto flex flex-col">
            <h2 className="font-bold text-md mb-2" style={{ color: primaryColor }}>
                Transkription (Aufnahme)
            </h2>

            <div className="text-xs font-light flex-1 leading-relaxed border rounded bg-white">
                <ReactQuill
                    // Use the prop value:
                    value={value} // <<< Change this

                    // Use the prop change handler:
                    onChange={onChange} // <<< Change this

                    modules={quillModules}
                    formats={quillFormats}
                    theme="snow"
                    readOnly={readOnly}
                />
            </div>

            <button
                onClick={onDownload}
                className="mt-3 inline-flex items-center border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150 ease-in-out self-start"
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
    );
};

export default OriginalTranscriptionDisplay;
