import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import QrTypeSelector from './QrTypeSelector';
import DynamicFields from './DynamicFields';
import DownloadButton from './DownloadButton';
import { generateQRCodeContent } from './qrCodeGenerators';

export default function IntQR() {
    const [qrType, setQrType] = useState('text');
    const [qrValue, setQrValue] = useState('');
    const [color, setColor] = useState('#000000');
    const [fields, setFields] = useState({});

    const handleFieldChange = (name, value) => {
        setFields((prevFields) => ({ ...prevFields, [name]: value }));
    };

    const generateQRCode = () => {
        const qrContent = generateQRCodeContent(qrType, fields);
        setQrValue(qrContent);
    };

    return (
        <div className="bg-white p-4 shadow-md rounded-lg">
            <div className="bg-slate-50 p-4">
                <h1 className="text-lg font-semibold mb-4">QR Code Generator</h1>

                {/* QR Code Type Selector */}
                <QrTypeSelector qrType={qrType} setQrType={setQrType} />

                {/* Dynamic Fields based on QR Code Type */}
                <DynamicFields qrType={qrType} fields={fields} handleFieldChange={handleFieldChange} />

                {/* QR Code Color Picker */}
                <label className="block text-gray-700 mb-2">QR Code Color:</label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full p-2 mb-4"
                />

                {/* Generate Button */}
                <button
                    onClick={generateQRCode}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Generate QR Code
                </button>

                {/* Display QR Code and Download Button */}
                {qrValue && (
                    <div className="mt-4 flex flex-col items-center">
                        <QRCodeCanvas value={qrValue} size={150} fgColor={color} />
                        <DownloadButton />
                    </div>
                )}
            </div>
        </div>
    );
}
