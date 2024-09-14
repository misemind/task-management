import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IssueType, IssueTypeDocument } from '../entities/issue-type.entity';
import { CreateIssueTypeDto } from '../dto/create-issue-type.dto';
import { UpdateIssueTypeDto } from '../dto/update-issue-type.dto';

@Injectable()
export class IssueTypeRepository {
  constructor(@InjectModel(IssueType.name) private readonly issueTypeModel: Model<IssueTypeDocument>) {}

  async create(createIssueTypeDto: CreateIssueTypeDto): Promise<IssueType> {
    const newIssueType = new this.issueTypeModel(createIssueTypeDto);
    return newIssueType.save();
  }

  async findById(id: string): Promise<IssueType | null> {
    const issueType = await this.issueTypeModel.findById(id).exec();
    if (!issueType) {
      throw new NotFoundException(`IssueType not found with ID: ${id}`);
    }
    return issueType;
  }

  async update(id: string, updateIssueTypeDto: UpdateIssueTypeDto): Promise<IssueType | null> {
    return this.issueTypeModel.findByIdAndUpdate(id, updateIssueTypeDto, { new: true }).exec();
  }

  async delete(id: string): Promise<IssueType | null> {
    return this.issueTypeModel.findByIdAndDelete(id).exec();
  }
}