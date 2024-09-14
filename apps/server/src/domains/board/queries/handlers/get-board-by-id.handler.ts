import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BoardRepository } from '@app/domains/board/repositories/board.repository';
import { GetBoardByIdQuery } from '@app/domains/board/queries/impl/get-board-by-id.query';
import { Board } from '@app/domains/board/entities/board.entity';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetBoardByIdQuery)
export class GetBoardByIdHandler implements IQueryHandler<GetBoardByIdQuery> {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(query: GetBoardByIdQuery): Promise<Board | null> {
    const board = await this.boardRepository.findById(query.id);

    if (!board) {
      throw new NotFoundException(`Board not found with ID: ${query.id}`);
    }

    return board;
  }
}