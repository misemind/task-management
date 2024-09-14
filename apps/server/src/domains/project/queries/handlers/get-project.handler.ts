import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProjectRepository } from '@app/domains/project/repositories/project.repository';
import { GetProjectByIdQuery } from '@app/domains/project/queries/impl/get-project.query';
import { Project } from '@app/domains/project/entities/project.entity';
import { ProjectDocumentService } from '@app/domains/project-document/services/project-document.service';
import { Inject, NotFoundException } from '@nestjs/common';

@QueryHandler(GetProjectByIdQuery)
export class GetProjectByIdHandler implements IQueryHandler<GetProjectByIdQuery> {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectDocumentService: ProjectDocumentService,
  ) {}

  async execute(query: GetProjectByIdQuery): Promise<any> {
    const { id } = query;

    // Fetch the project by ID
    const project = await this.projectRepository.findById(id);

    if (!project) {
      throw new NotFoundException(`Project not found with ID: ${id}`);
    }

    // Fetch the related project documents
    const projectDocuments = await this.projectDocumentService.getProjectDocuments(id);

    // Manually construct the response object
    const response = {
      _id: project._id,
      title: project.title,
      description: project.description,
      priority: project.priority,
      status: project.status,
      endDate: project.endDate,
      startDate: project.startDate,
      privacy: project.privacy,
      category: project.category,
      thumbnailImage: project.thumbnailImage,
      tags: project.tags,
      teamLead: project.teamLead,
      skills: project.skills,
      updated: project.updated,
      employees: project.employees,
      createDate: project.createDate,
      commentIds: project.commentIds,
      employeeCount: project.employeeCount,
      documents: projectDocuments,  // Add the documents to the response
    };

    return response;
  }
}
