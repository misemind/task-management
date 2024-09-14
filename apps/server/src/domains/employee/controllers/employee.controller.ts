import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEmployeeDto } from '@app/domains/employee/dto/create-employee.dto';
import { UpdateEmployeeDto } from '@app/domains/employee/dto/update-employee.dto';
import { EmployeeService } from '@app/domains/employee/services/employee.service';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';

@ApiTags('Employee')
@Controller('api/employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiResponse({ status: 201, description: 'The employee has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.createEmployee(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({ status: 200, description: 'Return all employees.' })
  findAll(@Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.employeeService.getAllEmployees(limit, page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  @ApiResponse({ status: 200, description: 'Return the employee.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  findOne(@Param('id') id: string) {
    return this.employeeService.getEmployeeById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an employee by ID' })
  @ApiResponse({ status: 200, description: 'The employee has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.updateEmployee(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an employee by ID' })
  @ApiResponse({ status: 200, description: 'The employee has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  remove(@Param('id') id: string) {
    return this.employeeService.deleteEmployee(id);
  }
}
