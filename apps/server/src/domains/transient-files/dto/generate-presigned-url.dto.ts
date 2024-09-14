import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, IsOptional, IsNumber } from 'class-validator';

export class GeneratePresignedUrlDto {

    @ApiProperty({ description: 'The name of the file to be uploaded or downloaded', example: 'document.pdf' })
    @IsString()
    @IsNotEmpty()
    readonly fileName: string;

    @ApiProperty({ description: 'The expiration time in seconds for the presigned URL', example: 3600 })
    @IsOptional()
    @IsNumber()
    readonly expiresInSeconds?: number;

    @ApiProperty({ description: 'The HTTP method for the presigned URL ("GET" or "PUT")' })
    @IsIn(['GET', 'PUT']) // Enforce that method must be either "GET" or "PUT"
    @IsNotEmpty()
    readonly method: 'GET' | 'PUT';
}
