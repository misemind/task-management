// apps/server/src/domains/activity/controllers/activity.controller.ts
import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { CreateActivityDto } from '@app/domains/activity/dto/create-activity.dto';
import { UpdateActivityDto } from '@app/domains/activity/dto/update-activity.dto';
import { ActivityService } from '@app/domains/activity/services/activity.service';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';
import { Activity } from '@app/domains/activity/entities/activity.entity';

@ApiTags('Activity')
@Controller('api/activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiResponse({ status: 201, description: 'The activity has been successfully created.', type: Activity })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.createActivity(createActivityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all activities' })
  @ApiResponse({ status: 200, description: 'Return all activities.', type: [Activity] })
  findAll(@Query() paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.activityService.getAllActivities(limit, page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an activity by ID' })
  @ApiResponse({ status: 200, description: 'Return the activity.', type: Activity })
  @ApiResponse({ status: 404, description: 'Activity not found.' })
  findOne(@Param('id') id: string) {
    return this.activityService.getActivityById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an activity by ID' })
  @ApiResponse({ status: 200, description: 'The activity has been successfully updated.', type: Activity })
  @ApiResponse({ status: 404, description: 'Activity not found.' })
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activityService.updateActivity(id, updateActivityDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an activity by ID' })
  @ApiResponse({ status: 200, description: 'The activity has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Activity not found.' })
  remove(@Param('id') id: string) {
    return this.activityService.deleteActivity(id);
  }
}
