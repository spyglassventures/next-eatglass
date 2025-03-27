// used for speach

// File: utils/docxGenerator.ts
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

/**
 * Generates a DOCX file from content using a template.
 *
 * @param content The text content to insert into the template.
 * @param templatePath The path to the .docx template file (relative to /public).
 * @param outputFilename The desired name for the downloaded file.
 * @returns True if successful, false otherwise.
 */
export const generateDocx = async (
    content: string,
    templatePath: string,
    outputFilename: string
): Promise<boolean> => {
    if (!content) {
        console.error("No content provided for DOCX generation.");
        return false;
    }

    try {
        // 1. Fetch the template
        const response = await fetch(templatePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch template: ${response.statusText} at ${templatePath}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        // 2. Initialize PizZip and Docxtemplater
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true, // Automatically handle \n line breaks
        });

        // 3. Set data (assuming template uses {{message}})
        // Ensure line breaks are correctly handled (though linebreaks: true helps)
        doc.setData({ message: content });

        // 4. Render the document
        doc.render();

        // 5. Generate the output blob
        const out = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        // 6. Trigger download
        saveAs(out, outputFilename);
        return true; // Indicate success

    } catch (error) {
        console.error(`Error generating DOCX for ${outputFilename}: `, error);
        alert(`Fehler beim Generieren des Word-Dokuments (${outputFilename}). Details im Konsolenlog.`);
        return false; // Indicate failure
    }
};