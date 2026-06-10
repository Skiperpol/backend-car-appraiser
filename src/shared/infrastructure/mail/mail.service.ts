import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import nodemailer, { type Transporter } from 'nodemailer';

type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
};

@Injectable()
export class MailService {
  private transporter: Transporter | null = null;

  private getTransporter(): Transporter {
    if (this.transporter) {
      return this.transporter;
    }

    const host = process.env.SMTP_HOST?.trim();
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim();

    if (!host || !user || !pass) {
      throw new ServiceUnavailableException(
        'Serwer poczty nie jest skonfigurowany. Ustaw SMTP_HOST, SMTP_USER i SMTP_PASS.',
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    return this.transporter;
  }

  async sendMail(input: SendMailInput): Promise<void> {
    const from =
      process.env.SMTP_FROM?.trim() ||
      process.env.SMTP_USER?.trim() ||
      'no-reply@car-appraiser.local';

    try {
      await this.getTransporter().sendMail({
        from,
        to: input.to,
        subject: input.subject,
        text: input.text,
        attachments: input.attachments,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Nie udalo sie wyslac wiadomosci.';
      throw new InternalServerErrorException(message);
    }
  }
}
