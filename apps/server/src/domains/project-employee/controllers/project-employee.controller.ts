import { Controller, Get, Query, Param, Post, Body, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateProjectEmployeeDto } from '@app/domains/project-employee/dto/create-project-employee.dto';
import { ProjectEmployeeService } from '@app/domains/project-employee/services/project-employee.service';

@ApiTags('Project Employee')
@Controller('api/project-employees')
export class ProjectEmployeeController {
  constructor(private readonly projectEmployeeService: ProjectEmployeeService) { }

  @Post()
  @ApiOperation({ summary: 'Assign an employee to a project' })
  @ApiResponse({ status: 201, description: 'The employee has been successfully assigned to the project.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createProjectEmployeeDto: CreateProjectEmployeeDto) {
    return this.projectEmployeeService.createProjectEmployee(createProjectEmployeeDto);
  }

  @Get('by-project/:projectId')
  @ApiOperation({ summary: 'Get employees assigned to a project with pagination' })
  @ApiResponse({ status: 200, description: 'Return employees assigned to the project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiParam({ name: 'projectId', description: 'ID of the project' })
  async findByProjectId(
    @Param('projectId') projectId: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    const skip = (page - 1) * limit;
    return this.projectEmployeeService.findByProjectIdWithPagination(projectId, limit, skip);
  }

  @Get('by-employee/:employeeId')
  @ApiOperation({ summary: 'Get projects assigned to an employee with pagination' })
  @ApiResponse({ status: 200, description: 'Return projects assigned to the employee.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  @ApiParam({ name: 'employeeId', description: 'ID of the employee' })
  async findByEmployeeId(
    @Param('employeeId') employeeId: string,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    const skip = (page - 1) * limit;
    return this.projectEmployeeService.findByEmployeeIdWithPagination(employeeId, limit, skip);
  }

  @Delete('by-project-and-employee')
  @ApiOperation({ summary: 'Remove an employee from a project' })
  @ApiResponse({ status: 200, description: 'The employee has been successfully removed from the project.' })
  @ApiResponse({ status: 404, description: 'ProjectEmployee assignment not found.' })
  remove(
    @Query('projectId') projectId: string,
    @Query('employeeId') employeeId: string,
  ) {
    return this.projectEmployeeService.deleteProjectEmployee(projectId, employeeId);
  }
}
