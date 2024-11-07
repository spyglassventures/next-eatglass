import React from 'react';

export default function DynamicFields({ qrType, fields, handleFieldChange }) {
    switch (qrType) {
        case 'text':
            return (
                <input
                    type="text"
                    value={fields.text || ''}
                    onChange={(e) => handleFieldChange('text', e.target.value)}
                    placeholder="Text oder URL eingeben"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
            );

        case 'vcard':
            return (
                <>
                    <input
                        type="text"
                        value={fields.firstName || ''}
                        onChange={(e) => handleFieldChange('firstName', e.target.value)}
                        placeholder="Vorname"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                        type="text"
                        value={fields.lastName || ''}
                        onChange={(e) => handleFieldChange('lastName', e.target.value)}
                        placeholder="Nachname"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                        type="text"
                        value={fields.phone || ''}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        placeholder="Telefon"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                        type="email"
                        value={fields.email || ''}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        placeholder="E-Mail"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                        type="text"
                        value={fields.org || ''}
                        onChange={(e) => handleFieldChange('org', e.target.value)}
                        placeholder="Organisation"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                </>
            );

        case 'call':
            return (
                <input
                    type="text"
                    value={fields.phone || ''}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    placeholder="Telefonnummer"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
            );

        case 'sms':
            return (
                <>
                    <input
                        type="text"
                        value={fields.phone || ''}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        placeholder="Telefonnummer"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                        type="text"
                        value={fields.message || ''}
                        onChange={(e) => handleFieldChange('message', e.target.value)}
                        placeholder="Nachricht"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                </>
            );

        case 'whatsapp':
            return (
                <>
                    <input
                        type="text"
                        value={fields.phone || ''}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        placeholder="WhatsApp Nummer (+41...)"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                        type="text"
                        value={fields.message || ''}
                        onChange={(e) => handleFieldChange('message', e.target.value)}
                        placeholder="Nachricht"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                </>
            );

        case 'geo':
            return (
                <>
                    {/* Input fields for latitude and longitude */}
                    <input
                        type="text"
                        value={fields.latitude || ''}
                        onChange={(e) => handleFieldChange('latitude', e.target.value)}
                        placeholder="Breitengrad (z.B. 47.3769)"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                        type="text"
                        value={fields.longitude || ''}
                        onChange={(e) => handleFieldChange('longitude', e.target.value)}
                        placeholder="Längengrad (z.B. 8.5417)"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />

                    {/* Instructions and note about loading time */}
                    <p className="text-gray-700 mb-4">
                        Die Karte muss derzeit noch getrennt in einem neuen Fenster geöffnet werden. Um die GPS-Koordinaten zu erhalten, klicken Sie mit der rechten Maustaste auf die gewünschte Stelle in der Karte und wählen Sie **Was ist hier?**. Die Koordinaten werden unten auf der Karte angezeigt. Verwenden Sie das Format:
                        <br />
                        <strong>Breitengrad:</strong> z.B. 47.3769
                        <br />
                        <strong>Längengrad:</strong> z.B. 8.5417
                    </p>

                    {/* Google Maps iFrame */}
                    {/* <div className="mt-4">
                        <iframe
                            title="Google Maps"
                            width="100%"
                            height="300"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2760.229615791536!2d8.5416947!3d47.3768867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47900a227b1b1a55%3A0xe3ad021bfcab07d2!2sZ%C3%BCrich%2C%20Schweiz!5e0!3m2!1sde!2sch!4v1614876761584!5m2!1sde!2sch"
                            allowFullScreen
                        ></iframe>
                    </div> */}

                    {/* Full-Screen Google Maps Button */}
                    <button
                        onClick={() => window.open('https://www.google.com/maps', '_blank')}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Karte in Google Maps öffnen
                    </button>
                </>
            );



        case 'event':
            return (
                <>
                    <input
                        type="text"
                        value={fields.title || ''}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        placeholder="Event-Titel"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                        type="text"
                        value={fields.description || ''}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        placeholder="Beschreibung"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                        type="datetime-local"
                        value={fields.startDate || ''}
                        onChange={(e) => handleFieldChange('startDate', e.target.value)}
                        placeholder="Startdatum"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                        type="datetime-local"
                        value={fields.endDate || ''}
                        onChange={(e) => handleFieldChange('endDate', e.target.value)}
                        placeholder="Enddatum"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />

                    {/* Calendar Type Selector */}
                    <select
                        value={fields.calendarType || 'outlook'}
                        onChange={(e) => handleFieldChange('calendarType', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                    >
                        <option value="outlook">Outlook</option>
                        <option value="google">Google Kalender</option>
                        <option value="ical"> iCalendar (ICS, Apple)</option>

                    </select>

                    {/* Conditional Note for iCalendar (ICS) */}
                    {fields.calendarType === 'ical' && (
                        <p className="text-red-600 text-sm mt-2">
                            Hinweis: Der QR-Code ist für Apple iCal derzeit nicht direkt nutzbar. Bitte laden Sie die .ics-Datei herunter und senden Sie sie per E-Mail.
                        </p>
                    )}

                    {/* Timezone Selector */}
                    <select
                        value={fields.timezone || 'Europe/Zurich'}
                        onChange={(e) => handleFieldChange('timezone', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                    >
                        <option value="Europe/Zurich">Zürich/Bern</option>
                        <option value="Europe/Berlin">Berlin</option>
                        <option value="Europe/Paris">Paris</option>
                    </select>
                </>
            );



        case 'email':
            return (
                <>
                    <input
                        type="email"
                        value={fields.recipient || ''}
                        onChange={(e) => handleFieldChange('recipient', e.target.value)}
                        placeholder="Empfänger E-Mail"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                        type="text"
                        value={fields.subject || ''}
                        onChange={(e) => handleFieldChange('subject', e.target.value)}
                        placeholder="Betreff"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <textarea
                        value={fields.content || ''}
                        onChange={(e) => handleFieldChange('content', e.target.value)}
                        placeholder="Inhalt"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                </>
            );

        case 'wifi':
            return (
                <>
                    <input
                        type="text"
                        value={fields.ssid || ''}
                        onChange={(e) => handleFieldChange('ssid', e.target.value)}
                        placeholder="SSID"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <input
                        type="password"
                        value={fields.password || ''}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        placeholder="Passwort"
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    />
                    <select
                        value={fields.encryption || 'WPA'}
                        onChange={(e) => handleFieldChange('encryption', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-2"
                    >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Keine</option>
                    </select>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={fields.isHidden || false}
                            onChange={(e) => handleFieldChange('isHidden', e.target.checked)}
                        />
                        <span>Verstecktes Netzwerk</span>
                    </label>
                </>
            );

        default:
            return null;
    }
}
