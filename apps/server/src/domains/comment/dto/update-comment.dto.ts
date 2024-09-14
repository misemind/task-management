import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ description: 'Updated content of the comment' })
  @IsString()
  @IsNotEmpty()
  content: string;
}