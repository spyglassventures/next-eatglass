import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import { GroupedItem } from './TardocTranscription'; // Passe Pfad ggf. an
import JSZipUtils from 'jszip-utils';

export const generateWordDoc = async (groups: GroupedItem[]) => {
    const totalTarmed = groups.reduce((sum, g) => sum + parseFloat(g.TARMED_SUM), 0);
    const totalTardoc = groups.reduce((sum, g) => sum + parseFloat(g.TARDOC_SUM), 0);
    const delta = totalTardoc - totalTarmed;
    const deltaRounded = delta.toFixed(2);

    // Prozentuale Differenz berechnen
    const percentDiff = totalTarmed === 0
        ? 0
        : ((delta / totalTarmed) * 100);

    const isBetter = delta > 0;
    const label = isBetter ? 'TARDOC besser c.p.' : 'TARDOC schlechter c.p.';
    const relChange = `${Math.abs(percentDiff).toFixed(1)}% ${isBetter ? 'Mehrertrag' : 'Verlust'} c.p. aufgrund von TARDOC`;

    const data = {
        groups,
        TOTAL_TARMED: totalTarmed.toFixed(2),
        TOTAL_TARDOC: totalTardoc.toFixed(2),
        TOTAL_DELTA: deltaRounded,
        DELTA_LABEL: label,
        RELATIVE_CHANGE: relChange
    };

    const content = await fetchTemplate('/forms/Blank/Briefkopf_blank_tardoc.docx'); // next-eatglass/public/forms/Blank/Briefkopf_blank_tardoc.docx

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    doc.setData(data);

    try {
        doc.render();
    } catch (error) {
        console.error('Docxtemplater error', error);
        throw error;
    }

    const out = doc.getZip().generate({ type: 'blob' });
    saveAs(out, 'TARMED_TARDOC_Report.docx');
};

const fetchTemplate = async (path: string): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        JSZipUtils.getBinaryContent(path, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
};
