import { Controller, Post, Delete, Param, Body, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { TransientFileService } from '@app/domains/transient-files/services/transient-file.service';
import { TransientFile } from '@app/domains/transient-files/entities/transient-file.entity';
import { CreateTransientFileDto } from '@app/domains/transient-files/dto/create-transient-file.dto';
import { GeneratePresignedUrlDto } from '@app/domains/transient-files/dto/generate-presigned-url.dto';

@ApiTags('Transient Files')
@Controller('transient-files')
export class TransientFileController {
    constructor(private readonly transientFileService: TransientFileService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new transient file record' })
    @ApiBody({ type: CreateTransientFileDto })
    @ApiResponse({ status: 201, description: 'Transient file record created successfully', type: TransientFile })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async createTransientFile(@Body() createTransientFileDto: CreateTransientFileDto): Promise<TransientFile> {
        const { filePath, expiresAt } = createTransientFileDto;
        return this.transientFileService.createTransientFile(filePath, new Date(expiresAt));
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a transient file record by ID' })
    @ApiParam({ name: 'id', description: 'ID of the transient file record' })
    @ApiResponse({ status: 200, description: 'Transient file record deleted successfully' })
    @ApiResponse({ status: 404, description: 'Transient file record not found' })
    async deleteTransientFile(@Param('id') id: string): Promise<TransientFile | null> {
        return this.transientFileService.deleteTransientFile(id);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Get a transient file record by ID' })
    @ApiParam({ name: 'id', description: 'ID of the transient file record' })
    @ApiResponse({ status: 200, description: 'Transient file record found', type: TransientFile })
    @ApiResponse({ status: 404, description: 'Transient file record not found' })
    async getTransientFile(@Param('id') id: string): Promise<TransientFile | null> {
        return this.transientFileService.getTransientFileById(id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'List all transient file records' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Return a list of transient file records.', type: [TransientFile] })
    async listTransientFiles(
        @Query('limit') limit = 10,
        @Query('page') page = 1,
    ): Promise<TransientFile[]> {
        return this.transientFileService.listAllTransientFiles(limit, page);
    }

    @Post('presigned-url')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Generate a presigned URL and create a transient file entry' })
    @ApiBody({ type: GeneratePresignedUrlDto })
    @ApiResponse({ status: 201, description: 'Presigned URL generated and entry created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async generatePresignedUrl(
        @Body() generatePresignedUrlDto: GeneratePresignedUrlDto,
    ): Promise<{ presignedUrl: string; filePath: string }> {
        return this.transientFileService.generatePresignedUrlAndCreateEntry(generatePresignedUrlDto);
    }
}
