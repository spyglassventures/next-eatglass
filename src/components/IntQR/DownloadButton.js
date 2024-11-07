import React from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

export default function DownloadButton() {
    const downloadQRCode = () => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'qrcode.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <button onClick={downloadQRCode} className="mt-2 flex items-center text-blue-500 hover:text-blue-600">
            <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
            Download QR Code
        </button>
    );
}
