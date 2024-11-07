// qrCodeGenerators.js
function formatDateForICal(dateString, timezone = 'Europe/Zurich') {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return timezone === 'UTC'
        ? `${year}${month}${day}T${hours}${minutes}${seconds}Z`
        : `TZID=${timezone}:${year}${month}${day}T${hours}${minutes}${seconds}`;
}

// Download function for debugging
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function generateQRCodeContent(type, fields) {
    switch (type) {
        case 'text':
            return fields.text || '';

        case 'vcard': {
            let vcfContent = 'BEGIN:VCARD\n';
            vcfContent += 'VERSION:4.0\n';
            vcfContent += `N:${fields.lastName || ''};${fields.firstName || ''};;;\n`;
            vcfContent += `FN:${fields.firstName || ''} ${fields.lastName || ''}\n`;
            if (fields.phone) vcfContent += `TEL;TYPE=cell:${fields.phone}\n`;
            if (fields.email) vcfContent += `EMAIL:${fields.email}\n`;
            if (fields.org) vcfContent += `ORG:${fields.org}\n`;
            vcfContent += 'END:VCARD';
            return vcfContent;
        }

        case 'call':
            return `tel:${fields.phone}`;

        case 'sms':
            return `sms:${fields.phone}?body=${encodeURIComponent(fields.message || '')}`;

        case 'whatsapp': {
            const baseUrl = `https://wa.me/${fields.phone}`;
            const message = fields.message ? `?text=${encodeURIComponent(fields.message.replace(/ /g, '+'))}` : '';
            return baseUrl + message;
        }

        case 'geo':
            return `geo:${fields.latitude || '0'},${fields.longitude || '0'}`;

        case 'event': {
            const startDate = formatDateForICal(fields.startDate, fields.timezone);
            const endDate = formatDateForICal(fields.endDate, fields.timezone);
            const title = fields.title || '';
            const description = fields.description || '';
            const timezone = fields.timezone || 'Europe/Zurich';

            if (fields.calendarType === 'google') {
                // Google Calendar URL
                const googleCalendarURL = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&ctz=${timezone}`;
                return googleCalendarURL;
            } else {
                // iCalendar (ICS) format for iCal and Outlook
                let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nBEGIN:VEVENT\n';
                icsContent += `SUMMARY:${title}\n`;
                icsContent += `DESCRIPTION:${description}\n`;
                icsContent += `DTSTART${startDate.includes('TZID') ? `;${startDate}` : `:${startDate}`}\n`;
                icsContent += `DTEND${endDate.includes('TZID') ? `;${endDate}` : `:${endDate}`}\n`;
                icsContent += 'END:VEVENT\nEND:VCALENDAR';

                // Trigger download for debugging
                const filename = fields.calendarType === 'outlook' ? 'event_outlook.ics' : 'event_ical.ics';
                downloadFile(filename, icsContent); // Trigger download
                return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
            }
        }

        case 'email':
            return `mailto:${fields.recipient}?subject=${encodeURIComponent(fields.subject || '')}&body=${encodeURIComponent(fields.content || '')}`;


        case 'wifi':
            return `WIFI:T:${fields.encryption};S:${fields.ssid};P:${fields.password};H:${fields.isHidden ? 'true' : 'false'};`;

        default:
            return fields.text || '';
    }
}
