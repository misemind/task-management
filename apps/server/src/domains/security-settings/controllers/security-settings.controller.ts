import { Controller, Post, Body, Put, Param, Delete, Get, Query, NotFoundException, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CreateSecuritySettingsDto } from '@app/domains/security-settings/dto/create-security-settings.dto';
import { UpdateSecuritySettingsDto } from '@app/domains/security-settings/dto/update-security-settings.dto';
import { SecuritySettings } from '@app/domains/security-settings/entities/security-settings.entity';
import { SecuritySettingsService } from '@app/domains/security-settings/services/security-settings.service';


@ApiTags('Security Settings')
@Controller('api/security-settings')
export class SecuritySettingsController {
  constructor(private readonly securitySettingsService: SecuritySettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new security settings' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The security settings have been successfully created.', type: SecuritySettings })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to create security settings.' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSecuritySettingsDto: CreateSecuritySettingsDto) {
    return this.securitySettingsService.createSecuritySettings(createSecuritySettingsDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update existing security settings' })
  @ApiParam({ name: 'id', description: 'ID of the security settings to update' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The security settings have been successfully updated.', type: SecuritySettings })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Security settings not found.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to update security settings.' })
  async update(
    @Param('id') id: string,
    @Body() updateSecuritySettingsDto: UpdateSecuritySettingsDto,
  ) {
    const updatedSecuritySettings = await this.securitySettingsService.updateSecuritySettings(id, updateSecuritySettingsDto);
    if (!updatedSecuritySettings) {
      throw new NotFoundException('Security settings not found');
    }
    return updatedSecuritySettings;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete security settings' })
  @ApiParam({ name: 'id', description: 'ID of the security settings to delete' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The security settings have been successfully deleted.', type: SecuritySettings })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Security settings not found.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to delete security settings.' })
  async delete(@Param('id') id: string) {
    const deletedSecuritySettings = await this.securitySettingsService.deleteSecuritySettings(id);
    if (!deletedSecuritySettings) {
      throw new NotFoundException('Security settings not found');
    }
    return deletedSecuritySettings;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get security settings by ID' })
  @ApiParam({ name: 'id', description: 'ID of the security settings to retrieve' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The security settings have been successfully retrieved.', type: SecuritySettings })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Security settings not found.' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to retrieve security settings.' })
  async getById(@Param('id') id: string) {
    const securitySettings = await this.securitySettingsService.getSecuritySettingsById(id);
    if (!securitySettings) {
      throw new NotFoundException('Security settings not found');
    }
    return securitySettings;
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of all security settings' })
  @ApiQuery({ name: 'limit', required: false, description: 'Maximum number of entities to return', type: Number, example: 10 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of security settings has been successfully retrieved.', type: [SecuritySettings] })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to retrieve security settings.' })
  async getAll(
    @Query('limit') limit = 10,
    @Query('page') page = 1,
  ) {
    return this.securitySettingsService.getAllSecuritySettings(limit, page);
  }
}