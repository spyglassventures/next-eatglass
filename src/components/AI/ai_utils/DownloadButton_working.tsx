import React, { useEffect, useState } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import axios from 'axios';

export default function GenDocxStructure({ message }) {
    const generateDocument = async () => {
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

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Nachricht exportieren</h2>
            <h3 className="text-1xl mb-4">
                Klicken Sie unten, um die Nachricht in ein Word-Dokument zu exportieren.
            </h3>

            <button
                onClick={generateDocument}
                className="bg-blue-500 text-white py-2 px-4 rounded"
            >
                Nachricht in Word exportieren
            </button>
        </div>
    );
}