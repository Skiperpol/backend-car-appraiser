import { Module } from '@nestjs/common';
import { REPORTS_REPOSITORY } from './application/ports/reports-repository.port';
import {
  CreateReportUseCase,
  DeleteReportUseCase,
  GetAllReportsUseCase,
  GetReportAggregateUseCase,
  GetReportByIdUseCase,
  GetReportFieldsConfigUseCase,
  PullReportsChangesUseCase,
  PushReportsChangesUseCase,
  UpsertReportAggregateUseCase,
  UpdateReportUseCase,
} from './application/use-cases/reports.use-cases';
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
    {
      provide: REPORTS_REPOSITORY,
      useClass: ReportsTypeOrmRepository,
    },
  ],
})
export class ReportsModule {}
