const sgMail = require('@sendgrid/mail');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        console.log('❌ Ungültige Methode:', req.method);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        firstName,
        lastName,
        dateOfBirth,
        insurance,
        insuranceNumber,
        hautproblem,
        dauer,
        behandlung,
        beginn,
        behandlungText,
        vergangenheit,
        vergangenheitText,
        allergien,
        allergienText,
        vorerkrankungen,
        vorerkrankungenText,
        medikamente,
        patientId,
    } = req.body;

    console.log('📨 Dermatologie-Formular erhalten');
    console.log('Body:', JSON.stringify(req.body, null, 2));

    // Validierung der wichtigsten Felder
    if (!firstName || !lastName || !dateOfBirth || !insurance || !insuranceNumber) {
        return res.status(400).json({ message: 'Pflichtfelder fehlen im Formular.' });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const subject = `Neue Hautfragebogen-Anfrage: ${firstName} ${lastName} (ID ${patientId})`;

    const medikamentenText = (medikamente || [])
        .map(
            (m, i) =>
                `<li><strong>${m.name || 'N/A'}</strong> – ${m.frequenz || '-'}, seit: ${m.seit || '-'}</li>`
        )
        .join('');

    const msg = {
        to: 'dm@spyglassventures.ch',
        from: 'dm+DocDialog@spyglassventures.ch', // Muss bei SendGrid verifiziert sein
        subject,
        text: `Neue Anfrage von ${firstName} ${lastName}.`,
        html: `
      <h2>Neue Hautfragebogen-Anfrage</h2>
      <p><strong>Patienten-ID:</strong> ${patientId}</p>
      <p><strong>Vorname:</strong> ${firstName}</p>
      <p><strong>Nachname:</strong> ${lastName}</p>
      <p><strong>Geburtsdatum:</strong> ${dateOfBirth}</p>
      <p><strong>Versicherung:</strong> ${insurance}</p>
      <p><strong>Versichertennummer:</strong> ${insuranceNumber}</p>
      <hr />
      <p><strong>1. Hautproblem:</strong><br/>${hautproblem}</p>
      <p><strong>2. Dauer:</strong> ${dauer}</p>
      <p><strong>3. Beginn:</strong> ${beginn}</p>
      <p><strong>4. Behandlung durchgeführt:</strong> ${behandlung}</p>
      <p><strong>Behandlungsdetails:</strong><br/>${behandlungText}</p>
      <p><strong>Medikamente:</strong></p>
      <ul>${medikamentenText}</ul>
      <p><strong>5. Frühere Hautveränderungen:</strong> ${vergangenheit}</p>
      <p><strong>Details:</strong><br/>${vergangenheitText}</p>
      <p><strong>6. Vorerkrankungen:</strong> ${vorerkrankungen}</p>
      <p><strong>Details:</strong><br/>${vorerkrankungenText}</p>
      <p><strong>7. Allergien bekannt:</strong> ${allergien}</p>
      <p><strong>Details:</strong><br/>${allergienText}</p>
    `,
    };

    console.log('🔧 SendGrid API Handler Triggered');

    console.log('📨 Dermatologie-Formular erhalten');
    console.log('Body:', JSON.stringify(req.body, null, 2));


    try {
        await sgMail.send(msg);
        console.log('✅ E-Mail erfolgreich gesendet');
        return res.status(200).json({ message: 'Anfrage erfolgreich gesendet!' });
    } catch (error) {
        console.error('❌ SendGrid-Fehler:', error.response?.body?.errors || error.message);
        return res.status(500).json({ message: 'Fehler beim Senden der E-Mail.' });
    }
}
