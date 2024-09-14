import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSprintCommand } from '../commands/impl/create-sprint.command';
import { DeleteSprintCommand } from '../commands/impl/delete-sprint.command';
import { UpdateSprintCommand } from '../commands/impl/update-sprint.command';
import { CreateSprintDto } from '../dto/create-sprint.dto';
import { UpdateSprintDto } from '../dto/update-sprint.dto';
import { GetSprintByIdQuery } from '../queries/impl/get-sprint-by-id.query';
import { GetSprintsByProjectIdQuery } from '../queries/impl/get-sprints-by-project-id.query';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';

@Injectable()
export class SprintService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async createSprint(createSprintDto: CreateSprintDto) {
    return this.commandBus.execute(new CreateSprintCommand(createSprintDto));
  }

  async updateSprint(id: string, updateSprintDto: UpdateSprintDto) {
    const sprint = await this.commandBus.execute(new UpdateSprintCommand(id, updateSprintDto));
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    return sprint;
  }

  async deleteSprint(id: string) {
    const sprint = await this.commandBus.execute(new DeleteSprintCommand(id));
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    return sprint;
  }

  async getSprintById(id: string) {
    const sprint = await this.queryBus.execute(new GetSprintByIdQuery(id));
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }
    return sprint;
  }

  async getSprintsByProjectId(projectId: string, paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.queryBus.execute(new GetSprintsByProjectIdQuery(projectId, limit, page));
  }
}