import { Module } from '@nestjs/common';
import { REPORTS_REPOSITORY } from './application/ports/reports-repository.port';
import {
  CreateReportUseCase,
  DeleteReportUseCase,
  GenerateReportPdfUseCase,
  GetAllReportsUseCase,
  GetReportAggregateUseCase,
  GetReportByIdUseCase,
  GetReportFieldsConfigUseCase,
  PullReportsChangesUseCase,
  PushReportsChangesUseCase,
  SendReportPdfEmailUseCase,
  UpsertReportAggregateUseCase,
  UpdateReportUseCase,
} from './application/use-cases/reports.use-cases';
import { ReportMailService } from './infrastructure/mail/report-mail.service';
import { ReportPdfService } from './infrastructure/pdf/report-pdf.service';
import { ReportFieldsConfigSeeder } from './infrastructure/typeorm/report-fields-config.seeder';
import { ReportsTypeOrmRepository } from './infrastructure/typeorm/reports-typeorm.repository';
import { ReportsController } from './presentation/controllers/reports.controller';
import { MailService } from '../../shared/infrastructure/mail/mail.service';

@Module({
  controllers: [ReportsController],
  providers: [
    CreateReportUseCase,
    GetAllReportsUseCase,
    GetReportByIdUseCase,
    UpdateReportUseCase,
    DeleteReportUseCase,
    GetReportFieldsConfigUseCase,
    GetReportAggregateUseCase,
    UpsertReportAggregateUseCase,
    PullReportsChangesUseCase,
    PushReportsChangesUseCase,
    GenerateReportPdfUseCase,
    SendReportPdfEmailUseCase,
    ReportPdfService,
    ReportMailService,
    MailService,
    ReportFieldsConfigSeeder,
    {
      provide: REPORTS_REPOSITORY,
      useClass: ReportsTypeOrmRepository,
    },
  ],
})
export class ReportsModule {}
