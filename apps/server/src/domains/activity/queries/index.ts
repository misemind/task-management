import { GetAllActivitiesHandler } from './handlers/get-all-activities.handler';
import { GetActivityByIdHandler } from './handlers/get-activity-by-id.handler';

export const ActivityQueryHandlers = [
  GetAllActivitiesHandler,
  GetActivityByIdHandler,
];