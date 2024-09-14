import { ICommand } from '@nestjs/cqrs';
import { UpdateBoardDto } from '@app/domains/board/dto/update-board.dto';

export class UpdateBoardCommand implements ICommand {
  constructor(public readonly id: string, public readonly updateBoardDto: UpdateBoardDto) {}
}