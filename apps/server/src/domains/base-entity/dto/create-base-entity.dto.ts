import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBaseEntityDto {
  @ApiProperty({ description: 'The type of the entity (e.g., Employee, Project)' })
  @IsString()
  @IsNotEmpty()
  readonly entityType: string;

  @ApiProperty({ description: 'The ID of the entity' })
  @IsString()
  @IsNotEmpty()
  readonly entityId: string;

  @ApiProperty({ description: 'Optional: name of the entity for easier reference' })
  @IsString()
  @IsOptional()
  readonly name?: string;
}