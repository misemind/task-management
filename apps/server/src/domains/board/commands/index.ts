import { CreateBoardHandler } from './handlers/create-board.handler';
import { DeleteBoardHandler } from './handlers/delete-board.handler';
import { UpdateBoardHandler } from './handlers/update-board.handler';

export const BoardCommandHandlers = [
  CreateBoardHandler,
  DeleteBoardHandler,
  UpdateBoardHandler,
];