import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BoardRepository } from '@app/domains/board/repositories/board.repository';
import { CreateBoardCommand } from '@app/domains/board/commands/impl/create-board.command';
import { Board } from '@app/domains/board/entities/board.entity';
import { Injectable } from '@nestjs/common';

@CommandHandler(CreateBoardCommand)
@Injectable()
export class CreateBoardHandler implements ICommandHandler<CreateBoardCommand> {
  constructor(private readonly boardRepository: BoardRepository) {}

  async execute(command: CreateBoardCommand): Promise<Board> {
    const { createBoardDto } = command;
    const createdBoard = await this.boardRepository.create(createBoardDto);
    return createdBoard;
  }
}