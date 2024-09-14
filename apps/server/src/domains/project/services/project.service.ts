import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProjectCommand } from '@app/domains/project/commands/impl/create-project.command';
import { DeleteProjectCommand } from '@app/domains/project/commands/impl/delete-project.command';
import { UpdateProjectCommand } from '@app/domains/project/commands/impl/update-project.command';
import { UpdateProjectDto } from '@app/domains/project/dto/update-project.dto';
import { GetAllProjectsQuery } from '@app/domains/project/queries/impl/get-all-projects.query';
import { GetProjectByIdQuery } from '@app/domains/project/queries/impl/get-project.query';
import { ActivityService } from '@app/domains/activity/services/activity.service';
import { CreateActivityDto } from '@app/domains/activity/dto/create-activity.dto';
import { RequestProjectDto } from '@app/domains/project/dto/request-project.dto';
import { ProjectDocumentService } from '@app/domains/project-document/services/project-document.service';
import { CreateProjectDocumentDto } from '@app/domains/project-document/dto/create-project-document.dto';
import { GetTotalProjectsCountQuery } from '@app/domains/project/queries/impl/get-total-projects-count.query';

@Injectable()
export class ProjectService {
  createProjectDocument: any;
  constructor(private commandBus: CommandBus, private queryBus: QueryBus, private activityService: ActivityService,
    private projectDocumentService: ProjectDocumentService) { }

  async createProject(requestProjectDto: RequestProjectDto) {
    try {

      const createProjectDto = requestProjectDto.toCreateProjectDTO();
      const project = await this.commandBus.execute(new CreateProjectCommand(createProjectDto));

      if (requestProjectDto.files && requestProjectDto.files.length > 0) {
        const files = requestProjectDto.files;
        for (let file of files) {
          const createProjectDocumentDto = new CreateProjectDocumentDto();
          createProjectDocumentDto.name = file.fileName;
          createProjectDocumentDto.path = file.filePath;
          createProjectDocumentDto.projectId = project._id;
          createProjectDocumentDto.size = file.fileSize;
          createProjectDocumentDto.type = file.fileExtension;
          await this.projectDocumentService.createProjectDocument(createProjectDocumentDto);
        };
      }

      // Log the activity
      const activityDto: CreateActivityDto = {
        project_id: project._id,  // assuming project._id is the generated ID
        activityType: 'Project',
        activityTitle: 'Project Created',
        activityDescription: `Project titled "${project.title}" was created.`,
        status: 'New',
        priority: 'Medium',  // You can set this according to your needs
      };
      await this.activityService.createActivity(activityDto);

      return project;
    } catch (error) {
      console.log('ProjectService createProject', error);
      throw new InternalServerErrorException('Failed to create project');
    }
  }

  async updateProject(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.commandBus.execute(new UpdateProjectCommand(id, updateProjectDto));
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      // Log the activity
      const activityDto: CreateActivityDto = {
        project_id: project._id,
        activityType: 'Project',
        activityTitle: 'Project Updated',
        activityDescription: `Project titled "${project.title}" was updated.`,
        status: 'In Progress',  // Set according to the context
        priority: 'Medium',
      };
      await this.activityService.createActivity(activityDto);

      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log('ProjectService updateProject', error);
        throw error;
      }
      console.log('ProjectService updateProject', error);
      throw new InternalServerErrorException('Failed to update project');
    }
  }


  async deleteProject(id: string) {
    try {
      const project = await this.commandBus.execute(new DeleteProjectCommand(id));
      if (!project) {
        throw new NotFoundException('Project not found');
      }

      // Log the activity
      const activityDto: CreateActivityDto = {
        project_id: project._id,
        activityType: 'Project',
        activityTitle: 'Project Deleted',
        activityDescription: `Project titled "${project.title}" was deleted.`,
        status: 'Completed',
        priority: 'High',
      };
      await this.activityService.createActivity(activityDto);

      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log('ProjectService deleteProject', error);
        throw error;
      }
      console.log('ProjectService deleteProject', error);
      throw new InternalServerErrorException('Failed to delete project');
    }
  }

  async getProjectById(id: string) {
    try {
      const project = await this.queryBus.execute(new GetProjectByIdQuery(id));
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log('ProjectService getProjectById', error);
        throw error;
      }
      console.log('ProjectService getProjectById', error);
      throw new InternalServerErrorException('Failed to retrieve project');
    }
  }

  async getAllProjects(limit = 10, page = 1) {
    try {
      // Fetch the paginated projects
      const projects = await this.queryBus.execute(new GetAllProjectsQuery(limit, page));
  
      // Fetch the total number of projects
      const totalProjectsCount = await this.queryBus.execute(new GetTotalProjectsCountQuery());
  
      // Return the projects along with the total count
      return {
        total: totalProjectsCount,
        projects,
      };
    } catch (error) {
      console.log('ProjectService getAllProjects', error);
      throw new InternalServerErrorException('Failed to retrieve projects');
    }
  }
}
