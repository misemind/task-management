import { CreateTransientFileHandler } from './handlers/create-transient-file.handler';
import { DeleteTransientFileHandler } from './handlers/delete-transient-file.handler';

export const TransientFileCommandHandlers = [
  CreateTransientFileHandler,
  DeleteTransientFileHandler,
];
