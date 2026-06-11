import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DEFAULT_REPORT_FIELD_CONFIGS } from './report-fields-config.defaults';
import { ReportFieldsConfigEntity } from './reports.entities';

@Injectable()
export class ReportFieldsConfigSeeder implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    const repository = this.dataSource.getRepository(ReportFieldsConfigEntity);
    const now = new Date();

    for (const config of DEFAULT_REPORT_FIELD_CONFIGS) {
      const existing = await repository.findOneBy({ slug: config.slug });
      if (existing) {
        continue;
      }

      await repository.save(
        repository.create({
          slug: config.slug,
          label: config.label,
          fieldType: config.fieldType,
          exampleValue: config.exampleValue,
          createdAt: now,
          updatedAt: now,
        }),
      );
    }
  }
}
