import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId, IsDateString, IsBoolean } from 'class-validator';

export class CreateSprintDto {
  @ApiProperty({ description: 'The name of the sprint' })
  @IsString()
  @IsNotEmpty()
  sprintName: string;

  @ApiProperty({ description: 'The ID of the related board' })
  @IsMongoId()
  boardId: string;

  @ApiProperty({ description: 'The ID of the related project' })
  @IsMongoId()
  projectId: string;

  @ApiProperty({ description: 'The duration of the sprint' })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({ description: 'The start datetime of the sprint' })
  @IsDateString()
  startDatetime: string;

  @ApiProperty({ description: 'The end datetime of the sprint' })
  @IsDateString()
  endDatetime: string;

  @ApiProperty({ description: 'Is the sprint active' })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ description: 'The sprint goal' })
  @IsString()
  @IsNotEmpty()
  sprintGoal: string;
}