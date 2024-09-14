import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Issue, IssueDocument } from '../entities/issue.entity';
import { CreateIssueDto } from '../dto/create-issue.dto';
import { UpdateIssueDto } from '../dto/update-issue.dto';

@Injectable()
export class IssueRepository {
  constructor(@InjectModel(Issue.name) private readonly issueModel: Model<IssueDocument>) {}

  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    const newIssue = new this.issueModel(createIssueDto);
    return newIssue.save();
  }

  async findById(id: string): Promise<Issue | null> {
    const issue = await this.issueModel.findById(id).exec();
    if (!issue) {
      throw new NotFoundException(`Issue not found with ID: ${id}`);
    }
    return issue;
  }

  async findByProjectIdWithPagination(projectId: string, limit: number, skip: number): Promise<Issue[]> {
    return this.issueModel.find({ projectId }).skip(skip).limit(limit).exec();
  }

  async update(id: string, updateIssueDto: UpdateIssueDto): Promise<Issue | null> {
    return this.issueModel.findByIdAndUpdate(id, updateIssueDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Issue | null> {
    return this.issueModel.findByIdAndDelete(id).exec();
  }
}