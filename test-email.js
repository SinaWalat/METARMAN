import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

console.log('Sending test email using values:');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('User:', process.env.SMTP_USER);

transporter.sendMail({
  from: `"${process.env.SMTP_USER}" <${process.env.SMTP_USER}>`,
  to: 'booking@metarman.com',
  subject: 'Test connection from website setup',
  text: 'SMTP is working perfectly!',
}, (err, info) => {
  if (err) {
    console.error('Test failed:', err);
  } else {
    console.log('Test succeeded! Message ID:', info.messageId);
  }
});
