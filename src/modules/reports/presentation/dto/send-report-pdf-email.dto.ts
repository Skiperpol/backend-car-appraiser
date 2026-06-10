import { IsEmail } from 'class-validator';
import { GenerateReportPdfDto } from './generate-report-pdf.dto';

export class SendReportPdfEmailDto extends GenerateReportPdfDto {
  @IsEmail()
  recipientEmail!: string;
}
