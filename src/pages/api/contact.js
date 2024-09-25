import nodemailer from 'nodemailer';

export default async function ContactAPI(req, res) {
    const { name, email, message } = req.body;

    // Assume valid data input for simplicity

    const data = {
        name, email, message
    };

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use TLS
        auth: {
            user: process.env.NEXT_PUBLIC_EMAIL_USERNAME,
            pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD
        }
    });

    try {
    const mail = await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_EMAIL_USERNAME,
      to: process.env.NEXT_PUBLIC_EMAIL_USERNAME,
      replyTo: data.email,
      subject: `Webseiten Nachricht von ${data.name}`,
      text: data.message,
      html: `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
          }
          .container {
              background-color: #fff;
              border: 1px solid #ddd;
              padding: 20px;
              margin: 0 auto;
              width: 80%;
              box-shadow: 0 4px 8px rgba(0,0,0,0.05);
          }
          h1 {
              color: #333;
              font-size: 24px;
          }
          p {
              color: #666;
              font-size: 16px;
              line-height: 1.5;
          }
          .label {
              font-weight: bold;
          }
      </style>
      </head>
      <body>
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; margin: 0 auto; width: 80%; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
          <h1 style="color: #333; font-size: 24px;">Webseiten Kontaktformular</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
              <span style="font-weight: bold;">Name:</span> ${data.name}
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
              <span style="font-weight: bold;">Email:</span> ${data.email}
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
              <span style="font-weight: bold;">Message:</span> ${data.message}
          </p>
      </div>
  </div>
  
      </body>
      </html>
    `
    });

    console.log('Message sent: %s', mail.messageId);
    // Make sure to send a JSON response back to the client
    res.status(200).json({ message: "Email successfully sent!", messageId: mail.messageId });
} catch (error) {
    console.log(error);
    res.status(500).json({
        message: 'Could not send the email. Your message was not sent.',
        error: error.message // Provide error message details for the client if appropriate
    });
}
}

