import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEmployeeExperienceDto } from '@app/domains/employee-experiences/dto/create-employee-experience.dto';
import { UpdateEmployeeExperienceDto } from '@app/domains/employee-experiences/dto/update-employee-experience.dto';
import { EmployeeExperienceService } from '@app/domains/employee-experiences/services/employee-experience.service';

@ApiTags('Employee Experience')
@Controller('api/employee-experiences')
export class EmployeeExperienceController {
  constructor(private readonly employeeExperienceService: EmployeeExperienceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee experience' })
  @ApiResponse({ status: 201, description: 'The experience has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createEmployeeExperienceDto: CreateEmployeeExperienceDto) {
    return this.employeeExperienceService.createExperience(createEmployeeExperienceDto);
  }

  @Get(':employee_id')
  @ApiOperation({ summary: 'Get all experiences for an employee' })
  @ApiResponse({ status: 200, description: 'Return all experiences for the employee.' })
  findAll(@Param('employee_id') employee_id: string) {
    return this.employeeExperienceService.getExperiencesByEmployeeId(employee_id);
  }

  @Get('experience/:id')
  @ApiOperation({ summary: 'Get an experience by ID' })
  @ApiResponse({ status: 200, description: 'Return the experience.' })
  @ApiResponse({ status: 404, description: 'Experience not found.' })
  findOne(@Param('id') id: string) {
    return this.employeeExperienceService.getExperienceById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an experience by ID' })
  @ApiResponse({ status: 200, description: 'The experience has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Experience not found.' })
  update(@Param('id') id: string, @Body() updateEmployeeExperienceDto: UpdateEmployeeExperienceDto) {
    return this.employeeExperienceService.updateExperience(id, updateEmployeeExperienceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an experience by ID' })
  @ApiResponse({ status: 200, description: 'The experience has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Experience not found.' })
  remove(@Param('id') id: string) {
    return this.employeeExperienceService.deleteExperience(id);
  }
}
