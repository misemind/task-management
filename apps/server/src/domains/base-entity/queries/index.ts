import { GetAllBaseEntitiesHandler } from './handlers/get-all-base-entities.handler';
import { GetBaseEntityByIdHandler } from './handlers/get-base-entity-by-id.handler';

export const BaseEntityQueryHandlers = [
  GetAllBaseEntitiesHandler,
  GetBaseEntityByIdHandler,
];