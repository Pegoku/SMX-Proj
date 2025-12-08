import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions) {
  const { to, subject, text, html, replyTo } = options;

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.BUSINESS_NAME || 'Miquel A. Riudavets Mercadal'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || text,
      replyTo: replyTo || process.env.BUSINESS_EMAIL,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendContactNotification(contact: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  threadId: string;
}) {
  const businessEmail = process.env.BUSINESS_EMAIL;
  if (!businessEmail) {
    console.error('BUSINESS_EMAIL not configured');
    return { success: false, error: 'Business email not configured' };
  }

  const subject = `Nova consulta de ${contact.name}`;
  const text = `
Has rebut una nova consulta a través del formulari de contacte.

Nom: ${contact.name}
Email: ${contact.email}
Telèfon: ${contact.phone || 'No proporcionat'}

Missatge:
${contact.message}

---
ID de conversa: ${contact.threadId}
Per respondre, contesta directament a aquest email o accedeix al panell d'administració.
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #8B4513; }
    .message-box { background: white; padding: 15px; border-left: 4px solid #D2691E; margin-top: 10px; }
    .footer { background: #333; color: #999; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Nova Consulta de Client</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Nom:</span> ${contact.name}
      </div>
      <div class="field">
        <span class="label">Email:</span> <a href="mailto:${contact.email}">${contact.email}</a>
      </div>
      <div class="field">
        <span class="label">Telèfon:</span> ${contact.phone || 'No proporcionat'}
      </div>
      <div class="field">
        <span class="label">Missatge:</span>
        <div class="message-box">${contact.message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      ID de conversa: ${contact.threadId}<br>
      Miquel A. Riudavets Mercadal - Pintura i Reformes
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: businessEmail,
    subject,
    text,
    html,
    replyTo: contact.email,
  });
}

export async function sendReplyToCustomer(options: {
  customerEmail: string;
  customerName: string;
  replyMessage: string;
  originalSubject: string;
  threadId: string;
}) {
  const subject = `Re: ${options.originalSubject}`;
  const text = `
Hola ${options.customerName},

${options.replyMessage}

---
Miquel A. Riudavets Mercadal
Pintura i Reformes
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .message { background: white; padding: 20px; border-radius: 4px; }
    .footer { background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
    .footer a { color: #D2691E; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Miquel A. Riudavets Mercadal</h2>
      <p style="margin: 0; opacity: 0.9;">Pintura i Reformes</p>
    </div>
    <div class="content">
      <p>Hola ${options.customerName},</p>
      <div class="message">${options.replyMessage.replace(/\n/g, '<br>')}</div>
    </div>
    <div class="footer">
      <p>Miquel A. Riudavets Mercadal<br>
      Pintura i Reformes<br>
      <a href="mailto:${process.env.BUSINESS_EMAIL}">${process.env.BUSINESS_EMAIL}</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: options.customerEmail,
    subject,
    text,
    html,
  });
}

export async function sendConfirmationToCustomer(contact: {
  name: string;
  email: string;
}) {
  const subject = `Gràcies per contactar amb nosaltres - Miquel A. Riudavets Mercadal`;
  const text = `
Hola ${contact.name},

Gràcies per posar-te en contacte amb nosaltres. Hem rebut la teva consulta i et respondrem el més aviat possible.

Si tens alguna urgència, no dubtis en trucar-nos.

Salutacions cordials,
Miquel A. Riudavets Mercadal
Pintura i Reformes
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .footer { background: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Miquel A. Riudavets Mercadal</h2>
      <p style="margin: 0; opacity: 0.9;">Pintura i Reformes</p>
    </div>
    <div class="content">
      <p>Hola ${contact.name},</p>
      <p>Gràcies per posar-te en contacte amb nosaltres. Hem rebut la teva consulta i et respondrem el més aviat possible.</p>
      <p>Si tens alguna urgència, no dubtis en trucar-nos.</p>
      <p>Salutacions cordials,<br><strong>Miquel A. Riudavets Mercadal</strong></p>
    </div>
    <div class="footer">
      <p>Miquel A. Riudavets Mercadal<br>
      Pintura i Reformes</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({
    to: contact.email,
    subject,
    text,
    html,
  });
}
