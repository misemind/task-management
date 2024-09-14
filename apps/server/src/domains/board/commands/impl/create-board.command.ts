import { ICommand } from '@nestjs/cqrs';
import { CreateBoardDto } from '@app/domains/board/dto/create-board.dto';

export class CreateBoardCommand implements ICommand {
  constructor(public readonly createBoardDto: CreateBoardDto) {}
}