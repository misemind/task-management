import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBoardCommand } from '../commands/impl/create-board.command';
import { DeleteBoardCommand } from '../commands/impl/delete-board.command';
import { UpdateBoardCommand } from '../commands/impl/update-board.command';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { GetBoardByIdQuery } from '../queries/impl/get-board-by-id.query';
import { GetBoardsByProjectIdQuery } from '../queries/impl/get-boards-by-project-id.query';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';

@Injectable()
export class BoardService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async createBoard(createBoardDto: CreateBoardDto) {
    return this.commandBus.execute(new CreateBoardCommand(createBoardDto));
  }

  async updateBoard(id: string, updateBoardDto: UpdateBoardDto) {
    const board = await this.commandBus.execute(new UpdateBoardCommand(id, updateBoardDto));
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    return board;
  }

  async deleteBoard(id: string) {
    const board = await this.commandBus.execute(new DeleteBoardCommand(id));
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    return board;
  }

  async getBoardById(id: string) {
    const board = await this.queryBus.execute(new GetBoardByIdQuery(id));
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    return board;
  }

  async getBoardsByProjectId(projectId: string, paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;
    return this.queryBus.execute(new GetBoardsByProjectIdQuery(projectId, limit, page));
  }
}