import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import JSZipUtils from 'jszip-utils';
import { saveAs } from 'file-saver';

interface GroupedItem {
    TARMED: string;
    TARMED_TEXT: string;
    TP_TOTAL_TARMED: string;
    NUMBER_TARMED: string;
    tardoc: {
        TARDOC: string;
        TARDOC_TEXT: string;
        TP_TOTAL_TARDOC: string;
        NUMBER_TARDOC: string;
    }[];
}

export const generateWordDoc = async (groups: GroupedItem[]) => {
    const templatePath = '/forms/Blank/Briefkopf_blank_tardoc.docx'; // next-eatglass/public/forms/Blank/Briefkopf_blank_tardoc.docx

    const loadTemplate = (): Promise<ArrayBuffer> =>
        new Promise((resolve, reject) => {
            JSZipUtils.getBinaryContent(templatePath, (err, content) => {
                if (err) reject(err);
                else resolve(content);
            });
        });

    const content = await loadTemplate();
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    doc.setData({ groups });

    try {
        doc.render();
    } catch (error) {
        console.error('Template rendering error:', error);
        throw error;
    }

    const out = doc.getZip().generate({
        type: 'blob',
        mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    saveAs(out, 'tarmed_transcodiert.docx');
};
