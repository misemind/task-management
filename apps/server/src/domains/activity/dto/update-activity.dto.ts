// apps/server/src/domains/activity/dto/update-activity.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {}
