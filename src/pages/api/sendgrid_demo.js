const sgMail = require('@sendgrid/mail');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { firstName, lastName, phone, email, specialty } = req.body;

    // Log incoming request body
    console.log("Request Body:", req.body);

    // Validate required fields
    if (!firstName || !lastName || !phone || !email || !specialty) {
        return res.status(400).json({ message: 'Alle Felder sind notwendig für die Demo-Buchung.' });
    }

    // Construct the email content
    const msg = {
        to: 'dm@spyglassventures.ch', // Replace with your recipient's email
        from: 'dm+sender@spyglassventures.ch', // Replace with your verified sender email
        subject: `Demo-Anfrage von ${firstName} ${lastName}`,
        text: `Vorname: ${firstName}\nNachname: ${lastName}\nTelefon: ${phone}\nEmail: ${email}\nFachgebiet: ${specialty}`,
        html: `
      <strong>Vorname:</strong> ${firstName} <br>
      <strong>Nachname:</strong> ${lastName} <br>
      <strong>Telefon:</strong> ${phone} <br>
      <strong>Email:</strong> ${email} <br>
      <strong>Fachgebiet:</strong> <p>${specialty}</p>
    `,
    };

    try {
        await sgMail.send(msg);
        return res.status(200).json({ message: 'Demo-Anfrage erfolgreich gesendet!' });
    } catch (error) {
        console.error("SendGrid error:", error.response?.body?.errors || error.message);
        return res.status(500).json({ message: 'Fehler beim Senden der Anfrage. Bitte versuchen Sie es später erneut.' });
    }
}
