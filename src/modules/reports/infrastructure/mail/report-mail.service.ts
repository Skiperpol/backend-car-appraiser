import { Injectable } from '@nestjs/common';
import { MailService } from '../../../../shared/infrastructure/mail/mail.service';
import type { SendReportPdfEmailDto } from '../../presentation/dto/send-report-pdf-email.dto';
import { ReportPdfService } from '../pdf/report-pdf.service';

@Injectable()
export class ReportMailService {
  constructor(
    private readonly reportPdfService: ReportPdfService,
    private readonly mailService: MailService,
  ) {}

  async sendReportPdfEmail(payload: SendReportPdfEmailDto): Promise<void> {
    const pdfBuffer = await this.reportPdfService.generate(payload);
    const safeFileName = payload.reportNumber.replace(/[^\w.-]+/g, '_');

    await this.mailService.sendMail({
      to: payload.recipientEmail,
      subject: `Raport - ${payload.reportNumber}`,
      text: [
        `W załączeniu przesłano raport ${payload.reportNumber}.`,
        'Plik PDF zawiera szczegóły raportu oraz zdjęcia z komentarzami.',
      ].join('\n\n'),
      attachments: [
        {
          filename: `raport-${safeFileName}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
  }
}
