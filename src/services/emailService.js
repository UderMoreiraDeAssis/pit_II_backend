const nodemailer = require('nodemailer');
require('dotenv').config(); // Certifique-se de carregar variáveis de ambiente do .env

// Looking to send emails in production? Check out our Email API/SMTP product!
const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.EMAIL_USER, // Usuário SMTP fornecido pelo Mailtrap
    pass: process.env.EMAIL_PASS, // Senha SMTP fornecida pelo Mailtrap
  },
});

module.exports = {
  sendEmail: async (options) => {
    try {
      const mailOptions = {
        from: `"No Reply" <no-reply@demomailtrap.com>`, // Remetente com domínio configurado
        to: options.to, // Destinatário
        subject: options.subject, // Assunto
        text: options.text, // Corpo em texto
        html: options.html || null, // Corpo em HTML, se fornecido
      };

      const info = await transport.sendMail(mailOptions);
      console.log('Email enviado:', info.messageId);
      return info;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  },
};
