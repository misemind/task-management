import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProjectDocumentDto {
  @ApiProperty({ description: 'ID of the project' })
  @IsString()
  @IsOptional()
  projectId: string;

  @ApiProperty({ description: 'Name of the document' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Type of the document' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Path of the document' })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({ description: 'Size of the document' })
  @IsNumber()
  @IsOptional()
  size: number;
}