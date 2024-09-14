import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Name of the Skill' })
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Category of Skill' })
  readonly category: string;
}
