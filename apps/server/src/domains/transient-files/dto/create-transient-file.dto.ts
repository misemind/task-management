import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateTransientFileDto {
  @ApiProperty({ description: 'File path in the storage system' })
  @IsString()
  @IsNotEmpty()
  readonly filePath: string;

  @ApiProperty({ description: 'Expiration date and time for the transient file' })
  @IsDateString()
  @IsNotEmpty()
  readonly expiresAt: string;
}
