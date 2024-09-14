import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sprint, SprintDocument } from '../entities/sprint.entity';
import { CreateSprintDto } from '../dto/create-sprint.dto';
import { UpdateSprintDto } from '../dto/update-sprint.dto';

@Injectable()
export class SprintRepository {
  constructor(@InjectModel(Sprint.name) private readonly sprintModel: Model<SprintDocument>) {}

  async create(createSprintDto: CreateSprintDto): Promise<Sprint> {
    const newSprint = new this.sprintModel(createSprintDto);
    return newSprint.save();
  }

  async findById(id: string): Promise<Sprint | null> {
    const sprint = await this.sprintModel.findById(id).exec();
    if (!sprint) {
      throw new NotFoundException(`Sprint not found with ID: ${id}`);
    }
    return sprint;
  }

  async findByProjectIdWithPagination(projectId: string, limit: number, skip: number): Promise<Sprint[]> {
    return this.sprintModel.find({ projectId }).skip(skip).limit(limit).exec();
  }

  async update(id: string, updateSprintDto: UpdateSprintDto): Promise<Sprint | null> {
    return this.sprintModel.findByIdAndUpdate(id, updateSprintDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Sprint | null> {
    return this.sprintModel.findByIdAndDelete(id).exec();
  }
}