import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from '@app/domains/activity/entities/activity.entity';
import { CreateActivityDto } from '@app/domains/activity/dto/create-activity.dto';
import { UpdateActivityDto } from '@app/domains/activity/dto/update-activity.dto';

@Injectable()
export class ActivityRepository {
  constructor(@InjectModel(Activity.name) private readonly activityModel: Model<ActivityDocument>) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const newActivity = new this.activityModel(createActivityDto);
    return newActivity.save();
  }

  async findById(id: string): Promise<Activity | null> {
    return this.activityModel.findById(id).exec();
  }

  async findAll(limit: number, skip: number): Promise<Activity[]> {
    return this.activityModel.find().skip(skip).limit(limit).exec();
  }

  async update(id: string, updateActivityDto: UpdateActivityDto): Promise<Activity | null> {
    return this.activityModel.findByIdAndUpdate(id, updateActivityDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Activity | null> {
    return this.activityModel.findByIdAndDelete(id).exec();
  }
}