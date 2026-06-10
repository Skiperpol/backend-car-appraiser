import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ReportPdfDynamicFieldDto {
  @IsString()
  label!: string;

  @IsString()
  value!: string;
}

export class ReportPdfPhotoDto {
  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  imageBase64?: string;
}

export class GenerateReportPdfDto {
  @IsString()
  reportNumber!: string;

  @IsOptional()
  @IsString()
  assignedOrderId?: string;

  @IsOptional()
  @IsString()
  make?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  productionYear?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportPdfDynamicFieldDto)
  dynamicFields?: ReportPdfDynamicFieldDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportPdfPhotoDto)
  photos!: ReportPdfPhotoDto[];
}
