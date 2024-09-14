import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProjectDocumentDto } from '@app/domains/project-document/dto/create-project-document.dto';
import { UpdateProjectDocumentDto } from '@app/domains/project-document/dto/update-project-document.dto';
import { ProjectDocument } from '@app/domains/project-document/entities/project-document.entity';

@Injectable()
export class ProjectDocumentRepository {
  constructor(@InjectModel(ProjectDocument.name) private readonly projectDocumentModel: Model<ProjectDocument>) { }

  async create(createProjectDocumentDto: CreateProjectDocumentDto): Promise<ProjectDocument> {
    const newProjectDocument = new this.projectDocumentModel(createProjectDocumentDto);
    return newProjectDocument.save();
  }

  async findById(id: string): Promise<ProjectDocument | null> {
    const result = this.projectDocumentModel.findById(id).exec();
    return result;
  }

  async findAll(projectId: string): Promise<ProjectDocument[]> {
    return this.projectDocumentModel.find({ projectId }).exec();
  }

  async findAllWithPagination(projectId: string, limit: number, skip: number): Promise<ProjectDocument[]> {
    return this.projectDocumentModel.find({ projectId }).skip(skip).limit(limit).exec();
  }

  async update(id: string, updateProjectDocumentDto: UpdateProjectDocumentDto): Promise<ProjectDocument | null> {
    return this.projectDocumentModel.findByIdAndUpdate(id, updateProjectDocumentDto, { new: true }).exec();
  }

  async delete(id: string): Promise<ProjectDocument | null> {
    return this.projectDocumentModel.findByIdAndDelete(id).exec();
  }
  async countDocuments(projectId: string): Promise<number> {
    return this.projectDocumentModel.countDocuments({ projectId }).exec();
  }
}