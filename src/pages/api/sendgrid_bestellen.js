const sgMail = require('@sendgrid/mail');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Destructure incoming fields
    const {
        practiceName,
        address,
        postalCodeCity,
        phone,
        email,
        paymentMethod,
        plan, // Added plan field
        additionalInfo = "Keine Angaben", // Default value for optional field
    } = req.body;

    console.log("Request Body:", req.body); // Log for debugging

    // Validate required fields
    if (!practiceName || !address || !postalCodeCity || !phone || !email || !paymentMethod || !plan) {
        return res.status(400).json({ message: 'Alle Felder sind notwendig für die Bestellung.' });
    }

    // Construct the email content
    const msg = {
        to: 'dm@spyglassventures.ch', // Replace with recipient email
        from: 'dm+sender@spyglassventures.ch', // Replace with verified sender email
        subject: `Bestellung von ${practiceName}`,
        text: `
        Produkt: ${plan}
        Praxis / Name: ${practiceName}
        Adresse: ${address}
        PLZ / Ort: ${postalCodeCity}
        Telefon: ${phone}
        E-Mail: ${email}
        Zahlungsart: ${paymentMethod}
        Zusätzliche Informationen: ${additionalInfo}
        `,
        html: `
        <strong>Produkt:</strong> ${plan} <br>
        <strong>Praxis / Name:</strong> ${practiceName} <br>
        <strong>Adresse:</strong> ${address} <br>
        <strong>PLZ / Ort:</strong> ${postalCodeCity} <br>
        <strong>Telefon:</strong> ${phone} <br>
        <strong>E-Mail:</strong> ${email} <br>
        <strong>Zahlungsart:</strong> ${paymentMethod} <br>
        <strong>Zusätzliche Informationen:</strong> <p>${additionalInfo}</p>
        `,
    };

    try {
        await sgMail.send(msg);
        return res.status(200).json({ message: 'Bestellung erfolgreich gesendet!' });
    } catch (error) {
        console.error("SendGrid error:", error.response?.body?.errors || error.message);
        return res.status(500).json({ message: 'Fehler beim Senden der Bestellung. Bitte versuchen Sie es später erneut.' });
    }
}
