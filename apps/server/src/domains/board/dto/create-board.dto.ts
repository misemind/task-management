import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ description: 'The name of the board' })
  @IsString()
  @IsNotEmpty()
  boardName: string;

  @ApiProperty({ description: 'The ID of the related project' })
  @IsMongoId()
  projectId: string;
}