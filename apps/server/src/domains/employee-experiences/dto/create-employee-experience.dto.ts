import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEmployeeExperienceDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  readonly employee_id: string;

  @ApiProperty({ description: 'Job Title' })
  @IsString()
  @IsNotEmpty()
  readonly jobTitle: string;

  @ApiProperty({ description: 'Company Name' })
  @IsString()
  @IsNotEmpty()
  readonly companyName: string;

  @ApiProperty({ description: 'Start Year' })
  @IsString()
  @IsNotEmpty()
  readonly startYear: string;

  @ApiProperty({ description: 'End Year' })
  @IsString()
  @IsNotEmpty()
  readonly endYear: string;

  @ApiProperty({ description: 'Job Description', required: false })
  @IsString()
  readonly jobDescription?: string;
}
