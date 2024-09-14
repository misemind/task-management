import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsNumber, ValidateNested, IsArray } from 'class-validator';


export class FileDto {
  @ApiProperty({ description: 'URL of the file' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'Content type of the file' })
  @IsString()
  contentType: string;

  @ApiProperty({ description: 'Size of the file in bytes' })
  @IsNumber()
  size: number;
}

export class CreateCommentDto {
  @ApiProperty({ description: 'Content of the comment' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Parent comment ID, if this is a reply', required: false })
  @IsOptional()
  parentId?: string;

  @ApiProperty({
    description: 'Array of files attached to the comment',
    required: false,
    type: [FileDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];
}