import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  StreamableFile,
} from '@nestjs/common';
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
} from '../../application/use-cases/reports.use-cases';
import type {
  ReportAggregatePayload,
  ReportsPushChangesPayload,
} from '../../domain/reports-sync';
import { GenerateReportPdfDto } from '../dto/generate-report-pdf.dto';

@Controller('api/reports')
export class ReportsController {
  constructor(
    private readonly createReportUseCase: CreateReportUseCase,
    private readonly getAllReportsUseCase: GetAllReportsUseCase,
    private readonly getReportByIdUseCase: GetReportByIdUseCase,
    private readonly updateReportUseCase: UpdateReportUseCase,
    private readonly deleteReportUseCase: DeleteReportUseCase,
    private readonly getReportFieldsConfigUseCase: GetReportFieldsConfigUseCase,
    private readonly getReportAggregateUseCase: GetReportAggregateUseCase,
    private readonly upsertReportAggregateUseCase: UpsertReportAggregateUseCase,
    private readonly pullReportsChangesUseCase: PullReportsChangesUseCase,
    private readonly pushReportsChangesUseCase: PushReportsChangesUseCase,
    private readonly generateReportPdfUseCase: GenerateReportPdfUseCase,
  ) {}

  @Post()
  create(@Body() body: Record<string, unknown>) {
    return this.createReportUseCase.execute(body);
  }

  @Get()
  findAll() {
    return this.getAllReportsUseCase.execute();
  }

  @Get('fields-config')
  getFieldsConfig() {
    return this.getReportFieldsConfigUseCase.execute();
  }

  @Get('sync/pull')
  pullChanges(@Query('lastPulledAt') lastPulledAt?: string) {
    const parsedLastPulledAt = lastPulledAt ? Number(lastPulledAt) : undefined;
    return this.pullReportsChangesUseCase.execute(parsedLastPulledAt);
  }

  @Post('sync/push')
  @HttpCode(204)
  async pushChanges(@Body() body: ReportsPushChangesPayload) {
    await this.pushReportsChangesUseCase.execute(body);
  }

  @Post('pdf')
  @Header('Content-Type', 'application/pdf')
  async generatePdf(@Body() body: GenerateReportPdfDto) {
    const buffer = await this.generateReportPdfUseCase.execute(body);
    const safeFileName = body.reportNumber.replace(/[^\w.-]+/g, '_');

    return new StreamableFile(buffer, {
      type: 'application/pdf',
      disposition: `attachment; filename="raport-${safeFileName}.pdf"`,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getReportByIdUseCase.execute(id);
  }

  @Get(':id/aggregate')
  getAggregate(@Param('id', ParseIntPipe) id: number) {
    return this.getReportAggregateUseCase.execute(id);
  }

  @Put(':id/aggregate')
  upsertAggregate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ReportAggregatePayload,
  ) {
    return this.upsertReportAggregateUseCase.execute(id, body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, unknown>,
  ) {
    return this.updateReportUseCase.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.deleteReportUseCase.execute(id);
  }
}
