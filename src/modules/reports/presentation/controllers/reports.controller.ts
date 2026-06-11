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
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import type { JwtValidatedUser } from '../../../auth/infrastructure/jwt-access.strategy';
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
} from '../../application/use-cases/reports.use-cases';
import type {
  ReportAggregatePayload,
  ReportsPushChangesPayload,
} from '../../domain/reports-sync';
import { GenerateReportPdfDto } from '../dto/generate-report-pdf.dto';
import { SendReportPdfEmailDto } from '../dto/send-report-pdf-email.dto';

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
    private readonly sendReportPdfEmailUseCase: SendReportPdfEmailUseCase,
  ) {}

  @Post()
  create(
    @Body() body: Record<string, unknown>,
    @CurrentUser() user: JwtValidatedUser,
  ) {
    return this.createReportUseCase.execute({
      ...body,
      userId: user.userId,
    });
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

  @Post('pdf/email')
  @HttpCode(204)
  async sendPdfByEmail(@Body() body: SendReportPdfEmailDto) {
    await this.sendReportPdfEmailUseCase.execute(body);
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
    @CurrentUser() user: JwtValidatedUser,
  ) {
    return this.upsertReportAggregateUseCase.execute(id, body, user.userId);
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
