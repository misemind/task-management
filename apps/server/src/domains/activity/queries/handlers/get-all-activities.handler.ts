import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ActivityRepository } from '@app/domains/activity/repositories/activity.repository';
import { Activity } from '@app/domains/activity/entities/activity.entity';
import { GetAllActivitiesQuery } from '@app/domains/activity/queries/impl/get-all-activities.query';

@QueryHandler(GetAllActivitiesQuery)
export class GetAllActivitiesHandler implements IQueryHandler<GetAllActivitiesQuery> {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async execute(query: GetAllActivitiesQuery): Promise<Activity[]> {
    const { limit, page } = query;
    const skip = (page - 1) * limit;
    return this.activityRepository.findAll(limit, skip);
  }
}