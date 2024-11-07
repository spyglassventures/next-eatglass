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
        <div className="bg-white p-6 shadow-lg rounded-lg flex">
            {/* Left section: QR type, dynamic fields, and generate button */}
            <div className="w-3/5 pr-4 flex flex-col space-y-4">
                <h1 className="text-lg font-semibold mb-4">QR Code Generator</h1>

                {/* QR Code Type Selector */}
                <QrTypeSelector qrType={qrType} setQrType={setQrType} />

                {/* Dynamic Fields based on QR Code Type */}
                <DynamicFields qrType={qrType} fields={fields} handleFieldChange={handleFieldChange} />

                {/* Generate Button */}
                <button
                    onClick={generateQRCode}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Generate QR Code
                </button>
            </div>

            {/* Right section: Color picker, QR code preview, and download button */}
            <div className="w-2/5 flex flex-col items-center space-y-4">
                {/* Color Picker */}
                <div className="w-full flex flex-col items-start">
                    <label className="block text-gray-700 mb-1">QR Code Color:</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-16 h-16 p-1 border border-gray-300 rounded-full shadow-md mb-4 cursor-pointer"
                    />
                </div>

                {/* QR Code Display and Download Button */}
                {qrValue && (
                    <div className="flex flex-col items-center">
                        <QRCodeCanvas value={qrValue} size={180} fgColor={color} />
                        <DownloadButton />
                    </div>
                )}
            </div>
        </div>
    );
}
