// apps/server/src/domains/base-entity/controllers/base-entity.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBaseEntityDto } from '@app/domains/base-entity/dto/create-base-entity.dto';
import { UpdateBaseEntityDto } from '@app/domains/base-entity/dto/update-base-entity.dto';
import { BaseEntityService } from '@app/domains/base-entity/services/base-entity.service';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';

@ApiTags('BaseEntity')
@Controller('api/base-entities')
export class BaseEntityController {
  constructor(private readonly baseEntityService: BaseEntityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new base entity' })
  @ApiResponse({ status: 201, description: 'The base entity has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createBaseEntityDto: CreateBaseEntityDto) {
    return this.baseEntityService.createBaseEntity(createBaseEntityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all base entities' })
  @ApiResponse({ status: 200, description: 'Return all base entities.' })
  findAll(@Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.baseEntityService.getAllBaseEntities(limit, page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a base entity by ID' })
  @ApiResponse({ status: 200, description: 'Return the base entity.' })
  @ApiResponse({ status: 404, description: 'Base entity not found.' })
  findOne(@Param('id') id: string) {
    return this.baseEntityService.getBaseEntityById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a base entity by ID' })
  @ApiResponse({ status: 200, description: 'The base entity has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Base entity not found.' })
  update(@Param('id') id: string, @Body() updateBaseEntityDto: UpdateBaseEntityDto) {
    return this.baseEntityService.updateBaseEntity(id, updateBaseEntityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a base entity by ID' })
  @ApiResponse({ status: 200, description: 'The base entity has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Base entity not found.' })
  remove(@Param('id') id: string) {
    return this.baseEntityService.deleteBaseEntity(id);
  }
}
