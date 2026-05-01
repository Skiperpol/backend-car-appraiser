import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { ReportsRepositoryPort } from '../../application/ports/reports-repository.port';
import type {
  ReportAggregatePayload,
  ReportsPullChangesResponse,
  ReportsPushChangesPayload,
} from '../../domain/reports-sync';
import {
  BasicDataEntity,
  ReportAttachmentEntity,
  ReportDynamicValueEntity,
  ReportEntity,
  ReportFieldsConfigEntity,
} from './reports.entities';

@Injectable()
export class ReportsTypeOrmRepository implements ReportsRepositoryPort {
  constructor(private readonly dataSource: DataSource) {}

  async create(payload: Record<string, unknown>) {
    const repository = this.dataSource.getRepository(ReportEntity);
    const entity = repository.create(payload);
    return repository.save(entity);
  }

  findAll() {
    return this.dataSource.getRepository(ReportEntity).find();
  }

  findById(id: number) {
    return this.dataSource.getRepository(ReportEntity).findOneBy({ id });
  }

  async update(id: number, payload: Record<string, unknown>) {
    const repository = this.dataSource.getRepository(ReportEntity);
    const existing = await repository.findOneBy({ id });
    if (!existing) {
      return null;
    }

    return repository.save(repository.merge(existing, payload));
  }

  async delete(id: number) {
    const result = await this.dataSource.getRepository(ReportEntity).delete(id);
    return (result.affected ?? 0) > 0;
  }

  getFieldsConfig() {
    return this.dataSource
      .getRepository(ReportFieldsConfigEntity)
      .find({ order: { id: 'ASC' } });
  }

  async getAggregateByReportId(id: number) {
    const report = await this.dataSource
      .getRepository(ReportEntity)
      .findOneBy({ id });
    if (!report) {
      return null;
    }

    const [basicData, attachments, dynamicValues] = await Promise.all([
      this.dataSource
        .getRepository(BasicDataEntity)
        .findOneBy({ reportId: id }),
      this.dataSource
        .getRepository(ReportAttachmentEntity)
        .find({ where: { reportId: id }, order: { id: 'ASC' } }),
      this.dataSource
        .getRepository(ReportDynamicValueEntity)
        .find({ where: { reportId: id }, order: { id: 'ASC' } }),
    ]);

    return { report, basicData, attachments, dynamicValues };
  }

  async upsertAggregateByReportId(id: number, payload: ReportAggregatePayload) {
    return this.dataSource.transaction(async (manager) => {
      const reportRepo = manager.getRepository(ReportEntity);
      const basicDataRepo = manager.getRepository(BasicDataEntity);
      const attachmentRepo = manager.getRepository(ReportAttachmentEntity);
      const dynamicValuesRepo = manager.getRepository(ReportDynamicValueEntity);

      const existingReport = await reportRepo.findOneBy({ id });
      const report = await reportRepo.save(
        reportRepo.merge(existingReport ?? reportRepo.create({ id }), {
          ...payload.report,
          id,
        }),
      );

      let basicData: BasicDataEntity | null = null;
      if (payload.basicData !== undefined) {
        const existingBasicData = await basicDataRepo.findOneBy({
          reportId: id,
        });
        basicData = await basicDataRepo.save(
          basicDataRepo.merge(
            existingBasicData ?? basicDataRepo.create({ reportId: id }),
            {
              ...(payload.basicData ?? {}),
              reportId: id,
            },
          ),
        );
      } else {
        basicData = await basicDataRepo.findOneBy({ reportId: id });
      }

      if (payload.attachments) {
        await attachmentRepo.delete({ reportId: id });
        if (payload.attachments.length > 0) {
          await attachmentRepo.save(
            payload.attachments.map((attachment) =>
              attachmentRepo.create({
                ...attachment,
                reportId: id,
              }),
            ),
          );
        }
      }

      if (payload.dynamicValues) {
        await dynamicValuesRepo.delete({ reportId: id });
        if (payload.dynamicValues.length > 0) {
          await dynamicValuesRepo.save(
            payload.dynamicValues.map((value) =>
              dynamicValuesRepo.create({
                ...value,
                reportId: id,
              }),
            ),
          );
        }
      }

      const [attachments, dynamicValues] = await Promise.all([
        attachmentRepo.find({ where: { reportId: id }, order: { id: 'ASC' } }),
        dynamicValuesRepo.find({
          where: { reportId: id },
          order: { id: 'ASC' },
        }),
      ]);

      return { report, basicData, attachments, dynamicValues };
    });
  }

  async pullChanges(
    lastPulledAt?: number,
  ): Promise<ReportsPullChangesResponse> {
    const pullDate = lastPulledAt ? new Date(lastPulledAt) : undefined;
    const reportsRepo = this.dataSource.getRepository(ReportEntity);
    const basicDataRepo = this.dataSource.getRepository(BasicDataEntity);
    const dynamicRepo = this.dataSource.getRepository(ReportDynamicValueEntity);
    const attachmentsRepo = this.dataSource.getRepository(
      ReportAttachmentEntity,
    );
    const fieldsRepo = this.dataSource.getRepository(ReportFieldsConfigEntity);

    const [
      reports,
      basicData,
      reportDynamicValues,
      reportAttachments,
      reportFieldsConfig,
    ] = await Promise.all([
      pullDate
        ? reportsRepo
            .createQueryBuilder('r')
            .where('r.updated_at >= :pullDate', { pullDate })
            .getMany()
        : reportsRepo.find(),
      pullDate
        ? basicDataRepo
            .createQueryBuilder('b')
            .where('b.updated_at >= :pullDate', { pullDate })
            .getMany()
        : basicDataRepo.find(),
      pullDate
        ? dynamicRepo
            .createQueryBuilder('d')
            .where('d.updated_at >= :pullDate', { pullDate })
            .getMany()
        : dynamicRepo.find(),
      attachmentsRepo.find(),
      pullDate
        ? fieldsRepo
            .createQueryBuilder('f')
            .where('f.updated_at >= :pullDate', { pullDate })
            .getMany()
        : fieldsRepo.find(),
    ]);

    return {
      changes: {
        reports: { created: [], updated: reports, deleted: [] },
        basicData: { created: [], updated: basicData, deleted: [] },
        reportDynamicValues: {
          created: [],
          updated: reportDynamicValues,
          deleted: [],
        },
        reportAttachments: {
          created: [],
          updated: reportAttachments,
          deleted: [],
        },
        reportFieldsConfig: {
          created: [],
          updated: reportFieldsConfig,
          deleted: [],
        },
      },
      timestamp: Date.now(),
    };
  }

  async pushChanges(payload: ReportsPushChangesPayload): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      if (payload.reports && payload.reports.length > 0) {
        await manager.getRepository(ReportEntity).save(payload.reports);
      }

      if (payload.basicData && payload.basicData.length > 0) {
        await manager.getRepository(BasicDataEntity).save(payload.basicData);
      }

      if (
        payload.reportDynamicValues &&
        payload.reportDynamicValues.length > 0
      ) {
        await manager
          .getRepository(ReportDynamicValueEntity)
          .save(payload.reportDynamicValues);
      }

      if (payload.reportAttachments && payload.reportAttachments.length > 0) {
        await manager
          .getRepository(ReportAttachmentEntity)
          .save(payload.reportAttachments);
      }
    });
  }
}
