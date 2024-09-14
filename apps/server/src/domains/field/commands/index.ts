import { CreateFieldHandler } from './handlers/create-field.handler';
import { DeleteFieldHandler } from './handlers/delete-field.handler';
import { UpdateFieldHandler } from './handlers/update-field.handler';

export const FieldCommandHandlers = [
  CreateFieldHandler,
  DeleteFieldHandler,
  UpdateFieldHandler,
];