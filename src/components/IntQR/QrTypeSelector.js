import React from 'react';

export default function QrTypeSelector({ qrType, setQrType }) {
    return (
        <>
            <label className="block text-gray-700 mb-2">QR Code Type:</label>
            <select
                value={qrType}
                onChange={(e) => setQrType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4"
            >
                <option value="text">Text/URL</option>
                <option value="vcard">VCard</option>
                <option value="call">Call</option>
                {/* <option value="sms">SMS</option> */}
                <option value="whatsapp">WhatsApp</option>
                <option value="geo">Geolocation</option>
                <option value="event">Event</option>
                <option value="email">Email</option>
                <option value="wifi">Wi-Fi</option>
            </select>
        </>
    );
}
