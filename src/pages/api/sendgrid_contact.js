const sgMail = require('@sendgrid/mail');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { recipients, message, subject } = req.body;

    // Validate recipients, message, and subject
    if (!Array.isArray(recipients) || recipients.length === 0 || !message || !subject) {
        return res.status(400).json({ message: 'Recipients, subject, and message are required.' });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const emailList = recipients.join(', ');

    const msg = {
        to: recipients, // Accepts an array of email addresses
        from: 'dm+DocDialog@spyglassventures.ch', // Replace with your verified sender email
        subject: subject, // Dynamically set the subject
        text: `Nachricht: ${message}`,
        html: `
            <p><strong>Nachricht:</strong></p>
            <p>${message}</p>
        `,
    };

    try {
        await sgMail.send(msg);
        return res.status(200).json({ message: `Email sent successfully to: ${emailList}` });
    } catch (error) {
        console.error('SendGrid error:', error.response?.body?.errors || error.message);
        return res.status(500).json({ message: 'Failed to send email. Please try again later.' });
    }
}
