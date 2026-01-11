import { getInvoiceById } from '@/app/admin/invoices/actions';
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
  inReplyTo?: string;
  references?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export async function sendEmail(options: EmailOptions) {
  const { to, subject, text, html, replyTo, inReplyTo, references, attachments } = options;
  try {
    const mailOptions: any = {
      from: `"${process.env.BUSINESS_NAME || 'Miquel A. Riudavets Mercadal'}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || text,
      attachments,
    };

    // Set replyTo to bot email so replies come back to the bot
    if (replyTo) {
      mailOptions.replyTo = replyTo;
    }

    // For email threading
    if (inReplyTo) {
      mailOptions.inReplyTo = inReplyTo;
      mailOptions.references = references || inReplyTo;
    }

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendInvoice(invoiceId: string){
  // Get invoice PDF
  const invoicePdfUrl = `http://localhost:3000/api/admin/invoices/${invoiceId}/pdf`;

  // Fetch invoice PDF
  const response = await fetch(invoicePdfUrl);
  const pdfBuffer = await response.arrayBuffer();

  // Get invoice details to find client email
  const invoice = await getInvoiceById(invoiceId);
  if (!invoice || !invoice.client || !invoice.client.email) {
    return { success: false, error: 'Client email not found' };
  }
  
  const subject = `Factura #${invoice.number} de Miquel A. Riudavets Mercadal`;
  const text = 'Hello world';
  
  return sendEmail({
    to: invoice.client.email,
    subject,
    text,
    attachments: [
      {
        filename: `Factura-${invoice.number}.pdf`,
        content: Buffer.from(pdfBuffer),
        contentType: 'application/pdf',
      },
    ],
  });

}

export async function sendContactNotification(contact: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  threadId: string;
}) {
  const businessEmail = process.env.BUSINESS_EMAIL;
  const botEmail = process.env.SMTP_USER;
  
  if (!businessEmail) {
    console.error('BUSINESS_EMAIL not configured');
    return { success: false, error: 'Business email not configured' };
  }

  // Generate a unique message ID for threading
  const messageId = `<thread-${contact.threadId}@${process.env.EMAIL_DOMAIN || 'miquelriudavets.com'}>`;

  const subject = `[Consulta #${contact.threadId.slice(0, 8)}] Nova consulta de ${contact.name}`;
  const text = `
Has rebut una nova consulta a través del formulari de contacte.

Nom: ${contact.name}
Email: ${contact.email}
Telèfon: ${contact.phone || 'No proporcionat'}

Missatge:
${contact.message}

---
⚠️ IMPORTANT: Per respondre al client, NO responguis directament a aquest email.
Accedeix al panell d'administració: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/threads/${contact.threadId}

ID de conversa: ${contact.threadId}
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #2c5282; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #fafafa; padding: 20px; border: 1px solid #e2e8f0; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #2c5282; }
    .message-box { background: white; padding: 15px; border-left: 4px solid #c05621; margin-top: 10px; }
    .footer { background: #1e3a5f; color: #a0aec0; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
    .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 4px; margin-top: 15px; }
    .warning strong { color: #92400e; }
    .btn { display: inline-block; background: #c05621; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 10px; }
    .btn:hover { background: #ed8936; }
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
        <span class="label">Email:</span> ${contact.email}
      </div>
      <div class="field">
        <span class="label">Telèfon:</span> ${contact.phone || 'No proporcionat'}
      </div>
      <div class="field">
        <span class="label">Missatge:</span>
        <div class="message-box">${contact.message.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="warning">
        <strong>⚠️ IMPORTANT:</strong> Per respondre al client, accedeix al panell d'administració.<br>
        Les respostes s'enviaran automàticament des del sistema.
        <br><br>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/threads/${contact.threadId}" class="btn">Respondre al Client</a>
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
    // Don't set replyTo to customer - we want replies handled through admin panel
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
    .header { background: #2c5282; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #fafafa; padding: 20px; border: 1px solid #e2e8f0; }
    .message { background: white; padding: 20px; border-radius: 4px; border-left: 4px solid #c05621; }
    .footer { background: #1e3a5f; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
    .footer a { color: #ed8936; }
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
    .header { background: #2c5282; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #fafafa; padding: 20px; border: 1px solid #e2e8f0; }
    .footer { background: #1e3a5f; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
    .highlight { color: #2c5282; font-weight: bold; }
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
      <p>Salutacions cordials,<br><span class="highlight">Miquel A. Riudavets Mercadal</span></p>
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
