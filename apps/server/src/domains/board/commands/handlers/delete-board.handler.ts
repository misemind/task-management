import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BoardRepository } from '@app/domains/board/repositories/board.repository';
import { DeleteBoardCommand } from '@app/domains/board/commands/impl/delete-board.command';
import { Board } from '@app/domains/board/entities/board.entity';

@CommandHandler(DeleteBoardCommand)
export class DeleteBoardHandler implements ICommandHandler<DeleteBoardCommand> {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(command: DeleteBoardCommand): Promise<Board | null> {
    const { id } = command;
    return this.boardRepository.delete(id);
  }
}