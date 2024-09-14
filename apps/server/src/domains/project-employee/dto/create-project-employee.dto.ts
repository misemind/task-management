import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProjectEmployeeDto {
  @ApiProperty({ description: 'ID of the employee' })
  @IsString()
  @IsNotEmpty()
  readonly employeeId: string;

  @ApiProperty({ description: 'ID of the project' })
  @IsString()
  @IsNotEmpty()
  readonly projectId: string;

  @ApiProperty({ description: 'Role of the employee in the project' })
  @IsString()
  @IsNotEmpty()
  readonly role: string;

  @ApiProperty({ description: 'Status of the employee in the project' })
  @IsString()
  @IsNotEmpty()
  readonly status: string;
}