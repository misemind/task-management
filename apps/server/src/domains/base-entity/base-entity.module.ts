import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { BaseEntityService } from './services/base-entity.service';
import { BaseEntity, BaseEntitySchema } from './entities/base-entity.entity';
import { BaseEntityRepository } from './repositories/base-entity.repository';
import { BaseEntityCommandHandlers } from './commands';
import { BaseEntityQueryHandlers } from './queries';
import { BaseEntityController } from './controller/base-entity.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BaseEntity.name, schema: BaseEntitySchema }]),
    CqrsModule,
  ],
  controllers:[BaseEntityController],
  providers: [BaseEntityService, BaseEntityRepository, ...BaseEntityCommandHandlers, ...BaseEntityQueryHandlers],
})
export class BaseEntityModule {}