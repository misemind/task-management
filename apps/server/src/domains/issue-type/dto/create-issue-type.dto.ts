import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ValidateNested, IsArray, IsNumber, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { SectionDto } from './section.dto';

export class CreateIssueTypeDto {
  @ApiProperty({ description: 'The name of the issue type', default: 'Some Issue Type' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The description of the issue type', default: 'Some Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Sections for the issue type',default:{
    name:'',
    order:2,
    fields:['']
  } })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections: SectionDto[];
}
