import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
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
    const now = new Date();
    const entity = repository.create({
      ...payload,
      createdAt: now,
      updatedAt: now,
    });
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

    return repository.save(
      repository.merge(existing, {
        ...payload,
        updatedAt: new Date(),
      }),
    );
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

  private async resolveDynamicValues(
    manager: EntityManager,
    reportId: number,
    dynamicValues: Record<string, unknown>[],
  ) {
    const fieldsRepo = manager.getRepository(ReportFieldsConfigEntity);
    const fields = await fieldsRepo.find();
    const slugToId = new Map(
      fields
        .filter((field) => field.slug)
        .map((field) => [field.slug!, field.id]),
    );

    return dynamicValues
      .map((value) => {
        const fieldSlug = value.fieldSlug as string | undefined;
        const rawFieldId = value.fieldId as number | string | undefined;
        let fieldId =
          typeof rawFieldId === 'number'
            ? rawFieldId
            : rawFieldId != null && /^\d+$/.test(String(rawFieldId))
              ? Number(rawFieldId)
              : undefined;

        if (fieldSlug && slugToId.has(fieldSlug)) {
          fieldId = slugToId.get(fieldSlug);
        }

        if (fieldId == null || value.value == null) {
          return null;
        }

        return {
          fieldId,
          value: String(value.value),
          reportId,
        };
      })
      .filter((value): value is { fieldId: number; value: string; reportId: number } =>
        value != null,
      );
  }

  async upsertAggregateByReportId(id: number, payload: ReportAggregatePayload) {
    return this.dataSource.transaction(async (manager) => {
      const reportRepo = manager.getRepository(ReportEntity);
      const basicDataRepo = manager.getRepository(BasicDataEntity);
      const attachmentRepo = manager.getRepository(ReportAttachmentEntity);
      const dynamicValuesRepo = manager.getRepository(ReportDynamicValueEntity);
      const now = new Date();

      const existingReport = await reportRepo.findOneBy({ id });
      const report = await reportRepo.save(
        reportRepo.merge(existingReport ?? reportRepo.create({ id }), {
          ...payload.report,
          id,
          updatedAt: now,
          createdAt: existingReport?.createdAt ?? now,
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
              updatedAt: now,
              createdAt: existingBasicData?.createdAt ?? now,
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
                createdAt: now,
                updatedAt: now,
              }),
            ),
          );
        }
      }

      if (payload.dynamicValues) {
        await dynamicValuesRepo.delete({ reportId: id });
        const resolvedValues = await this.resolveDynamicValues(
          manager,
          id,
          payload.dynamicValues,
        );
        if (resolvedValues.length > 0) {
          await dynamicValuesRepo.save(
            resolvedValues.map((value) =>
              dynamicValuesRepo.create({
                ...value,
                createdAt: now,
                updatedAt: now,
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
      pullDate
        ? attachmentsRepo
            .createQueryBuilder('a')
            .where('a.updated_at >= :pullDate', { pullDate })
            .getMany()
        : attachmentsRepo.find(),
      pullDate
        ? fieldsRepo
            .createQueryBuilder('f')
            .where('f.updated_at >= :pullDate', { pullDate })
            .getMany()
        : fieldsRepo.find(),
    ]);

    const fieldSlugById = new Map(
      reportFieldsConfig
        .filter((field) => field.slug)
        .map((field) => [field.id, field.slug]),
    );

    return {
      changes: {
        reports: { created: [], updated: reports, deleted: [] },
        basicData: { created: [], updated: basicData, deleted: [] },
        reportDynamicValues: {
          created: [],
          updated: reportDynamicValues.map((value) => ({
            ...value,
            fieldSlug:
              value.fieldId != null
                ? fieldSlugById.get(value.fieldId)
                : undefined,
          })),
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
