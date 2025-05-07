// pages/api/sendgrid_dermatologie.js

import { NextApiRequest, NextApiResponse } from 'next';
const sgMail = require('@sendgrid/mail');

export default async function handler(req, res) {
    console.log('▶️ Received request at /api/sendgrid_dermatologie — method:', req.method);

    if (req.method !== 'POST') {
        console.error('❌ Invalid method:', req.method);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        dataOption,
        firstName,
        lastName,
        dateOfBirth,
        insurance,
        insuranceNumber,
        hautproblem,
        dauer,
        beginn,
        behandlung,
        behandlungText,
        vergangenheit,
        vergangenheitText,
        weitereSymptome,
        vorerkrankungen,
        vorerkrankungenText,
        allergien,
        allergienText,
        medikamente,
        patientId,
    } = req.body;

    console.log('📨 Payload:', JSON.stringify(req.body, null, 2));

    // --- Server-side Validation ---
    const missingFields = [];

    if (dataOption === 'form') {
        ['firstName', 'lastName', 'dateOfBirth', 'insurance', 'insuranceNumber'].forEach(field => {
            if (!req.body[field] || String(req.body[field]).trim() === '') {
                missingFields.push(field);
            }
        });
    }
    if (!hautproblem || !hautproblem.trim()) missingFields.push('hautproblem');
    if (!dauer) missingFields.push('dauer');
    if (!beginn) missingFields.push('beginn');
    if (!behandlung) missingFields.push('behandlung');
    if (behandlung === 'ja' && (!behandlungText || !behandlungText.trim())) missingFields.push('behandlungText');
    if (!vergangenheit) missingFields.push('vergangenheit');
    if (vergangenheit === 'ja' && (!vergangenheitText || !vergangenheitText.trim())) missingFields.push('vergangenheitText');
    if (!weitereSymptome) missingFields.push('weitereSymptome');
    if (
        weitereSymptome === 'ja' &&
        Array.isArray(vorerkrankungen) &&
        vorerkrankungen.length === 0 &&
        (!vorerkrankungenText || !vorerkrankungenText.trim())
    ) {
        missingFields.push('vorerkrankungen');
    }
    if (!allergien) missingFields.push('allergien');
    if (allergien === 'ja' && (!allergienText || !allergienText.trim())) missingFields.push('allergienText');

    if (missingFields.length > 0) {
        console.error('🚨 Validation failed. Missing or empty fields:', missingFields);
        return res
            .status(400)
            .json({ message: `Pflichtfelder fehlen: ${missingFields.join(', ')}` });
    }

    // --- Prepare SendGrid ---
    if (!process.env.SENDGRID_API_KEY) {
        console.error('❌ Missing SENDGRID_API_KEY in environment');
        return res.status(500).json({ message: 'Server configuration error.' });
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const subject = `Neue Hautfragebogen-Anfrage: ${firstName || '—'} ${lastName || '—'} (ID ${patientId})`;

    const medikamentenList = (medikamente || []).map((m, i) => (
        `<li><strong>${m.name || '–'}</strong> – ${m.frequenz || '–'}, seit: ${m.seit || '–'}</li>`
    )).join('');

    const htmlBody = `
    <h2>Neue Hautfragebogen-Anfrage</h2>
    <p><strong>Patienten-ID:</strong> ${patientId}</p>
    ${dataOption === 'form' ? `
      <p><strong>Vorname:</strong> ${firstName}</p>
      <p><strong>Nachname:</strong> ${lastName}</p>
      <p><strong>Geburtsdatum:</strong> ${dateOfBirth}</p>
      <p><strong>Versicherung:</strong> ${insurance}</p>
      <p><strong>Versichertennummer:</strong> ${insuranceNumber}</p>
      <hr/>
    ` : `
      <p><strong>Daten-Option:</strong> Karte (Foto wird separat gemailt)</p>
      <hr/>
    `}
    <p><strong>1. Hautproblem:</strong><br/>${hautproblem}</p>
    <p><strong>2. Dauer:</strong> ${dauer}</p>
    <p><strong>3. Beginn:</strong> ${beginn}</p>
    <p><strong>4. Behandlung durchgeführt:</strong> ${behandlung}</p>
    ${behandlung === 'ja' ? `<p><strong>Behandlungsdetails:</strong><br/>${behandlungText}</p>` : ''}
    ${medikamentenList ? `<p><strong>Medikamente:</strong></p><ul>${medikamentenList}</ul>` : ''}
    <p><strong>5. Frühere Hautveränderungen:</strong> ${vergangenheit}</p>
    ${vergangenheit === 'ja' ? `<p><strong>Details:</strong><br/>${vergangenheitText}</p>` : ''}
    <p><strong>6. Weitere Vorerkrankungen:</strong> ${weitereSymptome}</p>
    ${weitereSymptome === 'ja' ? `<p><strong>Ausgewählt:</strong> ${vorerkrankungen.join(', ')}</p>
    <p><strong>Details:</strong><br/>${vorerkrankungenText}</p>` : ''}
    <p><strong>7. Allergien bekannt:</strong> ${allergien}</p>
    ${allergien === 'ja' ? `<p><strong>Details:</strong><br/>${allergienText}</p>` : ''}
    <hr/>
    <p>Fotos bitte an <strong>spyglass@hin.ch</strong> mit Betreff <code>Hautproblem-ID ${patientId}</code> mailen.</p>
  `;

    const msg = {
        to: 'dm@spyglassventures.ch',
        from: 'dm+DocDialog@spyglassventures.ch',
        subject,
        text: `Neue Anfrage von ${firstName} ${lastName} (ID ${patientId}).`,
        html: htmlBody,
    };

    console.log('🔧 Sending email via SendGrid...');
    try {
        await sgMail.send(msg);
        console.log('✅ Email successfully sent');
        return res.status(200).json({ message: 'Anfrage erfolgreich gesendet!' });
    } catch (error) {
        // if SendGrid returns structured errors, log them:
        if (error.response?.body?.errors) {
            console.error('❌ SendGrid API errors:', error.response.body.errors);
        } else {
            console.error('❌ SendGrid unexpected error:', error.message);
        }
        return res.status(500).json({ message: 'Fehler beim Senden der E-Mail.' });
    }
}
