const nodemailer = require('nodemailer');

const smtpConfig = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    logger:false,
    debug: false
};

exports.sendEmailHelper = async function (from, to, subject, text, filename, contentBuffer) {
    try {
        let config = {
            from: process.env.EMAIL_SENDER,
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
        }
        //solo cuando hay algo para enviar se envia
        if (contentBuffer && filename) {
            config.attachments = [{
                filename: filename,
                content: contentBuffer
            }]
        }

        let transporter = nodemailer.createTransport(smtpConfig)
        let info = await transporter.sendMail(config);
        return info

    } catch (error) {
        //se propaga el error, se captura en el middleware
        throw error;
    }
}


