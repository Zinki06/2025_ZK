require('dotenv').config();
const nodemailer = require('nodemailer');

const email = process.env.EMAIL_USER || 'test@example.com';
const pass = process.env.EMAIL_PASS || 'password';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: pass
    }
});

module.exports = { transporter, email };
