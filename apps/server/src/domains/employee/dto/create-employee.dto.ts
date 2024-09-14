import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEmail, IsPhoneNumber, IsArray, IsNumber } from 'class-validator';

export class CreateEmployeeDto {

  @ApiProperty({ description: 'First name of the employee' })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ description: 'Last name of the employee', required: false })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ description: 'Phone number of the employee', required: false })
  @IsString()
  @IsPhoneNumber('IN')
  @IsOptional()
  readonly phoneNumber: string;

  @ApiProperty({ description: 'Email address of the employee', required: false })
  @IsString()
  @IsEmail()
  @IsOptional()
  readonly emailAddress: string;

  @ApiProperty({ description: 'Joining date of the employee', type: Date, required: false })
  @IsDateString()
  @IsOptional()
  readonly joiningDate?: Date;

  @ApiProperty({ description: 'Skills for the employee' })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  skills: string[];

  @ApiProperty({ description: 'Designation of the employee' })
  @IsString()
  @IsNotEmpty()
  readonly designation: string;

  @ApiProperty({ description: 'Website of the employee', required: false })
  @IsString()
  @IsOptional()
  readonly website?: string;

  @ApiProperty({ description: 'City of the employee', required: false })
  @IsString()
  @IsOptional()
  readonly city?: string;

  @ApiProperty({ description: 'Country of the employee', required: false })
  @IsString()
  @IsOptional()
  readonly country?: string;

  @ApiProperty({ description: 'Zip code of the employee', required: false })
  @IsString()
  @IsOptional()
  readonly zipCode?: string;

  @ApiProperty({ description: 'Description of the employee', required: false })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ description: 'Profile completion percentage of the employee', required: false })
  @IsNumber()
  @IsOptional()
  readonly profileCompletion?: number;

  @ApiProperty({ description: 'Social links of the employee', isArray: true, required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly socialLinks?: string[];

  @ApiProperty({ description: 'Password hash of the employee', required: false })
  @IsString()
  @IsOptional()
  readonly passwordHash: string;

  @ApiProperty({ description: 'Description number of projects' })
  @IsNumber()
  readonly projectNumber: number;

  @ApiProperty({ description: 'Description number of tasks' })
  @IsNumber()
  readonly taskNumber: number;

  @ApiProperty({ description: 'Profile Image Path', required: false })
  @IsString()
  @IsOptional()
  readonly profileImagePath: string;

  @ApiProperty({ description: 'Cover Image Path', required: false })
  @IsString()
  @IsOptional()
  readonly coverImagePath: string;



}
