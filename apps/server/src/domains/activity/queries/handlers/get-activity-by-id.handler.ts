import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ActivityRepository } from '@app/domains/activity/repositories/activity.repository';
import { GetActivityByIdQuery } from '@app/domains/activity/queries/impl/get-activity-by-id.query';
import { Activity } from '@app/domains/activity/entities/activity.entity';

@QueryHandler(GetActivityByIdQuery)
export class GetActivityByIdHandler implements IQueryHandler<GetActivityByIdQuery> {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async execute(query: GetActivityByIdQuery): Promise<Activity | null> {
    return this.activityRepository.findById(query.id);
  }
}