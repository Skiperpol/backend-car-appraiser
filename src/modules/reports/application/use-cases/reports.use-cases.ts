import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPORTS_REPOSITORY } from '../ports/reports-repository.port';
import type { ReportsRepositoryPort } from '../ports/reports-repository.port';
import type {
  ReportAggregatePayload,
  ReportsPushChangesPayload,
} from '../../domain/reports-sync';
import { ReportPdfService } from '../../infrastructure/pdf/report-pdf.service';
import type { GenerateReportPdfDto } from '../../presentation/dto/generate-report-pdf.dto';

@Injectable()
export class CreateReportUseCase {
  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly repository: ReportsRepositoryPort,
  ) {}

  execute(payload: Record<string, unknown>) {
    return this.repository.create(payload);
  }
}

@Injectable()
export class GetAllReportsUseCase {
  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly repository: ReportsRepositoryPort,
  ) {}

  execute() {
    return this.repository.findAll();
  }
}

@Injectable()
export class GetReportByIdUseCase {
  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly repository: ReportsRepositoryPort,
  ) {}

  async execute(id: number) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }

    return record;
  }
}

@Injectable()
export class UpdateReportUseCase {
  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly repository: ReportsRepositoryPort,
  ) {}

  async execute(id: number, payload: Record<string, unknown>) {
    const updated = await this.repository.update(id, payload);
    if (!updated) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }

    return updated;
  }
}

@Injectable()
export class DeleteReportUseCase {
  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly repository: ReportsRepositoryPort,
  ) {}

  async execute(id: number) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
  }
}

@Injectable()
export class GetReportFieldsConfigUseCase {
  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly repository: ReportsRepositoryPort,
  ) {}

  execute() {
    return this.repository.getFieldsConfig();
  }
}

@Injectable()
export class GetReportAggregateUseCase {
  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly repository: ReportsRepositoryPort,
  ) {}

  async execute(id: number) {
    const aggregate = await this.repository.getAggregateByReportId(id);
    if (!aggregate) {
      throw new NotFoundException(`Report aggregate for id ${id} not found`);
    }

    return aggregate;
  }
}

@Injectable()
export class UpsertReportAggregateUseCase {
  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly repository: ReportsRepositoryPort,
  ) {}

  execute(id: number, payload: ReportAggregatePayload) {
    return this.repository.upsertAggregateByReportId(id, payload);
  }
}

@Injectable()
export class PullReportsChangesUseCase {
  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly repository: ReportsRepositoryPort,
  ) {}

  execute(lastPulledAt?: number) {
    return this.repository.pullChanges(lastPulledAt);
  }
}

@Injectable()
export class PushReportsChangesUseCase {
  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly repository: ReportsRepositoryPort,
  ) {}

  execute(payload: ReportsPushChangesPayload) {
    return this.repository.pushChanges(payload);
  }
}

@Injectable()
export class GenerateReportPdfUseCase {
  constructor(private readonly reportPdfService: ReportPdfService) {}

  execute(payload: GenerateReportPdfDto) {
    return this.reportPdfService.generate(payload);
  }
}
