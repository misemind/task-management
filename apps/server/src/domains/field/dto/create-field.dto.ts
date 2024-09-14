import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsEnum, IsArray, IsOptional } from 'class-validator';

export class CreateFieldDto {
  @ApiProperty({ description: 'The name of the field' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The type of the field' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'The description of the field', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The default value of the field', required: false })
  @IsOptional()
  defaultValue?: any;

  @ApiProperty({ description: 'Whether the field is required' })
  @IsBoolean()
  @IsNotEmpty()
  required: boolean;

  @ApiProperty({ description: 'The field type (default or custom)' })
  @IsEnum(['default', 'custom'])
  fieldType: string;

  @ApiProperty({ description: 'Options for dropdown or multiselect fields', required: false })
  @IsArray()
  @IsOptional()
  options?: { value: string }[];
}