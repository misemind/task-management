import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BoardRepository } from '@app/domains/board/repositories/board.repository';
import { UpdateBoardCommand } from '@app/domains/board/commands/impl/update-board.command';
import { Board } from '@app/domains/board/entities/board.entity';
import { NotFoundException, Injectable } from '@nestjs/common';

@CommandHandler(UpdateBoardCommand)
@Injectable()
export class UpdateBoardHandler implements ICommandHandler<UpdateBoardCommand> {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(command: UpdateBoardCommand): Promise<Board | null> {
    const existingBoard = await this.boardRepository.findById(command.id);

    if (!existingBoard) {
      throw new NotFoundException('Board not found');
    }

    const updatedBoard = await this.boardRepository.update(command.id, command.updateBoardDto);
    return updatedBoard;
  }
}