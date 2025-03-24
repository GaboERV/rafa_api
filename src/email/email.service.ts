import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gabrie5887@gmail.com',
        pass: 'ffek sgtx klrq cvdz',
      },
    });
  }
  async send2FACode(email: string, twoFACode: string) {
    // Lógica para enviar el código 2FA al correo
    // Puede ser un correo HTML con el código
    await this.transporter.sendMail({
      to: email,
      subject: 'Código de verificación 2FA',
      text: `Tu código de verificación 2FA es: ${twoFACode}`,
    });
  }
  
}