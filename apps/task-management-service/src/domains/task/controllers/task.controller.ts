import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTaskDto } from '@app/domains/task/dto/create-task.dto';
import { UpdateTaskDto } from '@app/domains/task/dto/update-task.dto';
import { TaskService } from '@app/domains/task/services/task.service';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { BulkTaskDto } from '../dto/bulk-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from '@app/config/multerConfig';

@ApiTags('Task')
@Controller('api/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.createTask(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks.' })
  findAll(@Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.taskService.getAllTasks(limit, page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Return the task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  findOne(@Param('id') id: string) {
    return this.taskService.getTaskById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({ status: 200, description: 'The task has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 200, description: 'The task has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  remove(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }

  @Post('bulk-create')
  @UseInterceptors(FileInterceptor('file', MulterConfig('tasks')))
  async bulkCreate(@UploadedFile() file:any): Promise<any> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    // Pass the file buffer to the service
    return this.taskService.bulkCreateTasks(file.buffer);
  }

  @Put('bulk-update')
  async bulkUpdate(@Body() bulkTaskDto: BulkTaskDto): Promise<any> {
    return this.taskService.bulkUpdateTasks(bulkTaskDto.tasks);
  }
    // ---------------- Kafka Handlers ------------------

  // Kafka Event: Create Task
  @EventPattern('task.create')
  async handleTaskCreateEvent(@Payload() message: CreateTaskDto): Promise<void> {
    console.log('Received Kafka event for task.create:', message);
    await this.taskService.createTask(message);
  }

  // Kafka Request-Response: Get All Tasks
  @MessagePattern('task.getAll')
  async handleGetAllTasksRequest(): Promise<any> {
    console.log('Received Kafka request for task.getAll');
    return this.taskService.getAllTasks(10, 1); // You can adjust pagination as needed
  }

  // Kafka Request-Response: Get Task by ID
  @MessagePattern('task.getById')
  async handleGetTaskByIdRequest(@Payload() message: any): Promise<any> {
    console.log('Received Kafka request for task.getById:', message);
    return this.taskService.getTaskById(message.id);
  }

  // Kafka Event: Update Task
  @EventPattern('task.update')
  async handleTaskUpdateEvent(@Payload() message: any): Promise<void> {
    console.log('Received Kafka event for task.update:', message);
    await this.taskService.updateTask(message.id, message);
  }

  // Kafka Event: Delete Task
  @EventPattern('task.delete')
  async handleTaskDeleteEvent(@Payload() message: any): Promise<void> {
    console.log('Received Kafka event for task.delete:', message);
    await this.taskService.deleteTask(message.id);
  }
}