import React from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { EnvelopeIcon } from '@heroicons/react/24/solid';

export default function DownloadButton({ message }) {
    const generateWordDocument = async () => {
        try {
            // Fetch the Word template
            const response = await axios.get('/forms/Blank/Briefkopf_blank.docx', {
                responseType: 'arraybuffer',
            });

            // Load the template into PizZip
            const zip = new PizZip(response.data);

            // Initialize Docxtemplater with the template
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            // Set the data to replace {message} in the Word template
            doc.setData({ message });

            // Render the document
            doc.render();

            // Generate the updated document as a blob
            const updatedDoc = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            // Trigger download of the generated Word document
            saveAs(updatedDoc, 'Generated_Message.docx');
        } catch (error) {
            console.error('Error generating document:', error);
        }
    };

    const downloadTxtFile = () => {
        const blob = new Blob([message], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'Generated_Message.txt');
    };

    return (
        <div className="flex items-center border p-2 rounded-md bg-gray-100">
            {/* Word PNG */}
            <button
                onClick={generateWordDocument}
                className="h-5 w-5 mr-2"
                aria-label="Download Word"
            >
                <img
                    src="/images/brands/Microsoft-Word-Icon-PNG.png"
                    alt="Word Icon"
                    className="h-full w-full object-contain"
                />
            </button>

            {/* TXT Text */}
            <button
                onClick={downloadTxtFile}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 mr-2"
                aria-label="Download TXT"
            >
                .txt
            </button>

            {/* Email Icon */}
            <button
                onClick={() => alert('Email functionality is not implemented yet.')}
                className="h-5 w-5 text-gray-500 hover:text-gray-700 mr-2"
                aria-label="Send Email"
            >
                <EnvelopeIcon />
            </button>

            {/* Descriptive Text */}
            <span className="text-xs text-gray-600 font-medium">
                &larr; Co-Pilot Antwort verwenden (in Word/Txt oder mailen)
            </span>
        </div>
    );
}
