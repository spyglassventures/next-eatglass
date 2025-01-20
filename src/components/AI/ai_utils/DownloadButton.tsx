import React, { useState } from 'react';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import mailerConfig from 'src/config/mailerPageConfig.json';
import EmailModal from '../../Mailer/EmailModal';
import { format } from 'date-fns';

const defaultCC = mailerConfig.recipients?.emails || [];

export default function DownloadButton({ message }: { message: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [defaultRecipients] = useState(mailerConfig.recipients?.emails || []);
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState(''); // State for dynamically generated subject

    const generateWordDocument = async () => {
        try {
            const response = await axios.get('/forms/Blank/Briefkopf_blank.docx', {
                responseType: 'arraybuffer',
            });

            const zip = new PizZip(response.data);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            doc.setData({ message });
            doc.render();

            const updatedDoc = doc.getZip().generate({
                type: 'blob',
                mimeType:
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });

            saveAs(updatedDoc, 'Generated_Message.docx');
        } catch (error) {
            console.error('Error generating document:', error);
        }
    };

    const downloadTxtFile = () => {
        const blob = new Blob([message], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'Generated_Message.txt');
    };

    const handleEmailClick = () => {
        // Generate subject using emailDefaults?.subjectTemplate
        const subjectTemplate = mailerConfig.emailDefaults?.subjectTemplate || '';
        const currentDate = format(new Date(), 'dd.MM.yyyy');
        const generatedSubject = subjectTemplate.replace('{{date}}', currentDate);

        setSubject(generatedSubject); // Set the subject
        setIsModalOpen(true); // Open the modal
    };

    return (
        <>
            <div className="flex items-center border p-2 pt-3 pb-3 rounded-md bg-gray-100">
                <button
                    onClick={generateWordDocument}
                    className="h-5 w-5 mr-2"
                    aria-label="Download Word"
                >
                    <div className="relative h-5 w-5">
                        <Image
                            src="/images/brands/Microsoft-Word-Icon-PNG.png"
                            alt="Word Icon"
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes="(max-width: 768px) 100vw, 24px"
                        />
                    </div>
                </button>

                <button
                    onClick={downloadTxtFile}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 mr-2"
                    aria-label="Download TXT"
                >
                    .txt
                </button>

                <button
                    onClick={handleEmailClick} // Use handleEmailClick instead of directly setting isModalOpen
                    className="h-5 w-5 text-gray-500 hover:text-gray-700 mr-2"
                    aria-label="Send Email"
                >
                    <EnvelopeIcon />
                </button>

                <span className="text-xs text-gray-600 font-medium">
                    &larr; Co-Pilot Antwort verwenden (in Word/Txt oder mailen)
                </span>
            </div>

            {isModalOpen && (
                <EmailModal
                    defaultMessage={message}
                    defaultRecipients={defaultRecipients}
                    defaultSubject={subject} // Pass the generated subject
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}
