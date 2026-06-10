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
  UpsertReportAggregateUseCase,
  UpdateReportUseCase,
} from './application/use-cases/reports.use-cases';
import { ReportPdfService } from './infrastructure/pdf/report-pdf.service';
import { ReportsTypeOrmRepository } from './infrastructure/typeorm/reports-typeorm.repository';
import { ReportsController } from './presentation/controllers/reports.controller';

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
    ReportPdfService,
    {
      provide: REPORTS_REPOSITORY,
      useClass: ReportsTypeOrmRepository,
    },
  ],
})
export class ReportsModule {}
