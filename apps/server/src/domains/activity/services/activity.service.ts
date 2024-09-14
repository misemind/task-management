import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateActivityCommand } from '@app/domains/activity/commands/impl/create-activity.command';
import { DeleteActivityCommand } from '@app/domains/activity/commands/impl/delete-activity.command';
import { UpdateActivityCommand } from '@app/domains/activity/commands/impl/update-activity.command';
import { CreateActivityDto } from '@app/domains/activity/dto/create-activity.dto';
import { UpdateActivityDto } from '@app/domains/activity/dto/update-activity.dto';
import { GetAllActivitiesQuery } from '@app/domains/activity/queries/impl/get-all-activities.query';
import { GetActivityByIdQuery } from '@app/domains/activity/queries/impl/get-activity-by-id.query';

@Injectable()
export class ActivityService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async createActivity(createActivityDto: CreateActivityDto) {
    try {
      return await this.commandBus.execute(new CreateActivityCommand(createActivityDto));
    } catch (error) {
      console.log('ActivityService createActivity',error);
      throw new InternalServerErrorException('Failed to create activity', error);
    }
  }

  async updateActivity(id: string, updateActivityDto: UpdateActivityDto) {
    try {
      const activity = await this.commandBus.execute(new UpdateActivityCommand(id, updateActivityDto));
      if (!activity) {
        throw new NotFoundException('Activity not found');
      }
      return activity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log('ActivityService updateActivity',error);
      throw new InternalServerErrorException('Failed to update activity', error);
    }
  }

  async deleteActivity(id: string) {
    try {
      const activity = await this.commandBus.execute(new DeleteActivityCommand(id));
      if (!activity) {
        throw new NotFoundException('Activity not found');
      }
      return activity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log('ActivityService deleteActivity',error);
      throw new InternalServerErrorException('Failed to delete activity', error);
    }
  }

  async getActivityById(id: string) {
    try {
      const activity = await this.queryBus.execute(new GetActivityByIdQuery(id));
      if (!activity) {
        throw new NotFoundException('Activity not found');
      }
      return activity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.log('ActivityService getActivityById',error);
      throw new InternalServerErrorException('Failed to retrieve activity', error);
    }
  }

  async getAllActivities(limit = 10, page = 1) {
    try {
      return await this.queryBus.execute(new GetAllActivitiesQuery(limit, page));
    } catch (error) {
      console.log('ActivityService getAllActivities',error);
      throw new InternalServerErrorException('Failed to retrieve activities', error);
    }
  }
}