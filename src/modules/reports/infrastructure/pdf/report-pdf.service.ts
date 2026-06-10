import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { join } from 'path';
import type { GenerateReportPdfDto } from '../../presentation/dto/generate-report-pdf.dto';

const FONT_REGULAR = join(
  require.resolve('dejavu-fonts-ttf/ttf/DejaVuSans.ttf'),
);

const FONT_BOLD = join(
  require.resolve('dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf'),
);

@Injectable()
export class ReportPdfService {
  generate(payload: GenerateReportPdfDto): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ autoFirstPage: false, margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.registerFont('regular', FONT_REGULAR);
      doc.registerFont('bold', FONT_BOLD);

      this.addTitlePage(doc, payload.reportNumber);
      this.addInfoPage(doc, payload);
      this.addPhotoPages(doc, payload.photos);

      doc.end();
    });
  }

  private addTitlePage(doc: PDFKit.PDFDocument, reportNumber: string) {
    doc.addPage();
    const pageHeight = doc.page.height;
    const centerY = pageHeight / 2 - 40;

    doc
      .font('bold')
      .fontSize(36)
      .text('Raport', 50, centerY, { align: 'center' });

    doc
      .font('regular')
      .fontSize(20)
      .text(reportNumber, 50, centerY + 56, { align: 'center' });
  }

  private addInfoPage(doc: PDFKit.PDFDocument, payload: GenerateReportPdfDto) {
    doc.addPage();

    doc.font('bold').fontSize(22).text('Informacje o raporcie');
    doc.moveDown(1.5);

    this.addSectionTitle(doc, 'ZLECENIE');
    this.addField(doc, 'Przypisane zlecenie', payload.assignedOrderId);

    doc.moveDown(0.5);
    this.addSectionTitle(doc, 'PODSTAWOWE DANE');
    this.addField(doc, 'Numer raportu', payload.reportNumber);
    this.addField(doc, 'Marka', payload.make);
    this.addField(doc, 'Model', payload.model);
    this.addField(doc, 'VIN', payload.vin);
    this.addField(doc, 'Numer rejestracyjny', payload.registrationNumber);
    this.addField(doc, 'Rok produkcji', payload.productionYear);

    if (payload.dynamicFields && payload.dynamicFields.length > 0) {
      doc.moveDown(0.5);
      this.addSectionTitle(doc, 'DODATKOWE POLA');
      for (const field of payload.dynamicFields) {
        this.addField(doc, field.label, field.value);
      }
    }
  }

  private addPhotoPages(
    doc: PDFKit.PDFDocument,
    photos: GenerateReportPdfDto['photos'],
  ) {
    photos.forEach((photo, index) => {
      doc.addPage();

      doc
        .font('bold')
        .fontSize(18)
        .text(`Zdjecie ${index + 1}`, { align: 'left' });
      doc.moveDown(0.75);

      if (photo.imageBase64) {
        try {
          const imageBuffer = Buffer.from(photo.imageBase64, 'base64');
          doc.image(imageBuffer, {
            fit: [doc.page.width - 100, 420],
            align: 'center',
          });
        } catch {
          doc
            .font('regular')
            .fontSize(12)
            .fillColor('#666666')
            .text('Nie udalo sie wczytac zdjecia.');
          doc.fillColor('#000000');
        }
      } else {
        doc
          .font('regular')
          .fontSize(12)
          .fillColor('#666666')
          .text('Brak zdjecia.');
        doc.fillColor('#000000');
      }

      if (photo.comment?.trim()) {
        doc.moveDown(1);
        doc.font('bold').fontSize(13).text('Komentarz');
        doc
          .font('regular')
          .fontSize(12)
          .text(photo.comment.trim(), { align: 'left' });
      }
    });
  }

  private addSectionTitle(doc: PDFKit.PDFDocument, title: string) {
    doc.font('bold').fontSize(12).fillColor('#4b5563').text(title);
    doc.fillColor('#000000');
    doc.moveDown(0.35);
  }

  private addField(
    doc: PDFKit.PDFDocument,
    label: string,
    value?: string | null,
  ) {
    doc
      .font('bold')
      .fontSize(11)
      .text(`${label}:`, { continued: true })
      .font('regular')
      .text(` ${this.formatValue(value)}`);
    doc.moveDown(0.25);
  }

  private formatValue(value?: string | null): string {
    const trimmed = value?.trim();
    return trimmed ? trimmed : '-';
  }
}
