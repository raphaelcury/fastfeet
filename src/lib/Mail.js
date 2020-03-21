import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, auth } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: auth.user ? auth : null,
    });
  }

  sendMail(message) {
    return this.transporter.sendddMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
