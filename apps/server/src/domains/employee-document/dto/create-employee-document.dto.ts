import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateEmployeeDocumentDto {
  @ApiProperty({ description: 'ID of the employee' })
  @IsString()
  @IsOptional()
  readonly employeeId: string;

  @ApiProperty({ description: 'Name of the document' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'Type of the document' })
  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty({ description: 'Path of the document' })
  @IsString()
  @IsNotEmpty()
  readonly path: string;

  @ApiProperty({ description: 'Size of the document' })
  @IsNumber()
  @IsNotEmpty()
  readonly size: number;
}