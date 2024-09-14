import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class FieldValueDto {
  @ApiProperty({ description: 'The ID of the field' })
  @IsMongoId()
  fieldId: string;

  @ApiProperty({ description: 'The value for the field' })
  @IsNotEmpty()
  value: any;

  @ApiProperty({ description: 'The type of the field' })
  @IsString()
  @IsNotEmpty()
  type: string;
}