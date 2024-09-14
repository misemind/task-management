import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateFieldDto } from '@app/domains/field/dto/create-field.dto';
import { UpdateFieldDto } from '@app/domains/field/dto/update-field.dto';
import { FieldService } from '@app/domains/field/services/field.service';

@ApiTags('Field')
@Controller('api/fields')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new field' })
  @ApiResponse({ status: 201, description: 'The field has been successfully created.' })
  create(@Body() createFieldDto: CreateFieldDto) {
    return this.fieldService.createField(createFieldDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a field by ID' })
  @ApiResponse({ status: 200, description: 'Return the field.' })
  @ApiResponse({ status: 404, description: 'Field not found.' })
  findOne(@Param('id') id: string) {
    return this.fieldService.getFieldById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a field by ID' })
  @ApiResponse({ status: 200, description: 'The field has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateFieldDto: UpdateFieldDto) {
    return this.fieldService.updateField(id, updateFieldDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a field by ID' })
  @ApiResponse({ status: 200, description: 'The field has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.fieldService.deleteField(id);
  }
}