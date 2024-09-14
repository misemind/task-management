import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId, IsArray, ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { FieldValueDto } from './field-value.dto';

export class CreateIssueDto {
  @ApiProperty({ description: 'The summary of the issue' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({ description: 'The description of the issue' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The ID of the related project' })
  @IsMongoId()
  projectId: string;

  @ApiProperty({ description: 'The ID of the related issue type' })
  @IsMongoId()
  issueTypeId: string;

  @ApiProperty({ description: 'The field values for the issue' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldValueDto)
  @IsDefined()
  fieldValues: FieldValueDto[];
}