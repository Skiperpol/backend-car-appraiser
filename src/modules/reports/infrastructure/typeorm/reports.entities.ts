import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'BasicData' })
export class BasicDataEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'report_id', nullable: true })
  reportId?: number;

  @Column({ length: 255, nullable: true })
  brand?: string;

  @Column({ length: 255, nullable: true })
  model?: string;

  @Column({ length: 255, nullable: true })
  vin?: string;

  @Column({ name: 'registration_number', length: 255, nullable: true })
  registrationNumber?: string;

  @Column({ name: 'production_year', nullable: true })
  productionYear?: number;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;
}

@Entity({ name: 'Reports' })
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'report_number', length: 255, nullable: true })
  reportNumber?: string;

  @Column({ name: 'user_id', nullable: true })
  userId?: number;

  @Column({ name: 'order_id', nullable: true })
  orderId?: number;

  @Column({ name: 'order_number', length: 255, nullable: true })
  orderNumber?: string;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;
}

@Entity({ name: 'report_attachments' })
export class ReportAttachmentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'report_id', nullable: true })
  reportId?: number;

  @Column({ length: 255, nullable: true })
  url?: string;

  @Column({ length: 255, nullable: true })
  comment?: string;

  @Column({ length: 255, nullable: true })
  name?: string;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;
}

@Entity({ name: 'report_fields_config' })
export class ReportFieldsConfigEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255, nullable: true })
  label?: string;

  @Column({ name: 'field_type', length: 255, nullable: true })
  fieldType?: string;

  @Column({ name: 'example_value', length: 255, nullable: true })
  exampleValue?: string;

  @Column({ length: 255, nullable: true, unique: true })
  slug?: string;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;
}

@Entity({ name: 'report_dynamic_values' })
export class ReportDynamicValueEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'report_id', nullable: true })
  reportId?: number;

  @Column({ name: 'field_id', nullable: true })
  fieldId?: number;

  @Column({ length: 255, nullable: true })
  value?: string;

  @Column({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt?: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt?: Date;
}

export const reportsEntities = [
  BasicDataEntity,
  ReportEntity,
  ReportAttachmentEntity,
  ReportFieldsConfigEntity,
  ReportDynamicValueEntity,
];
