import { GetBoardByIdHandler } from './handlers/get-board-by-id.handler';
import { GetBoardsByProjectIdHandler } from './handlers/get-boards-by-project-id.handler';

export const BoardQueryHandlers = [
  GetBoardsByProjectIdHandler,
  GetBoardByIdHandler,
];