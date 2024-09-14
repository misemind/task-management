import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class SectionDto {
  @ApiProperty({ description: 'The name of the section' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The order of the section' })
  @IsNumber()
  order: number;

  @ApiProperty({ description: 'The field IDs associated with this section' })
  @IsArray()
  fields: Types.ObjectId[];
}