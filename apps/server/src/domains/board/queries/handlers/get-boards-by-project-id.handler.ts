import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BoardRepository } from '@app/domains/board/repositories/board.repository';
import { GetBoardsByProjectIdQuery } from '@app/domains/board/queries/impl/get-boards-by-project-id.query';
import { Board } from '@app/domains/board/entities/board.entity';

@QueryHandler(GetBoardsByProjectIdQuery)
export class GetBoardsByProjectIdHandler implements IQueryHandler<GetBoardsByProjectIdQuery> {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(query: GetBoardsByProjectIdQuery): Promise<Board[]> {
    const { projectId, limit, page } = query;
    const skip = (page - 1) * limit;

    return this.boardRepository.findByProjectIdWithPagination(projectId, limit, skip);
  }
}