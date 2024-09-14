
import { CreateBaseEntityHandler } from './handlers/create-base-entity.handler';
import { DeleteBaseEntityHandler } from './handlers/delete-base-entity.handler';
import { UpdateBaseEntityHandler } from './handlers/update-base-entity.handler';

export const BaseEntityCommandHandlers = [
  CreateBaseEntityHandler,
  DeleteBaseEntityHandler,
  UpdateBaseEntityHandler,
];