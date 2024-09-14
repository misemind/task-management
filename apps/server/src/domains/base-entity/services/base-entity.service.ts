import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBaseEntityCommand } from '@app/domains/base-entity/commands/impl/create-base-entity.command';
import { DeleteBaseEntityCommand } from '@app/domains/base-entity/commands/impl/delete-base-entity.command';
import { UpdateBaseEntityCommand } from '@app/domains/base-entity/commands/impl/update-base-entity.command';
import { CreateBaseEntityDto } from '@app/domains/base-entity/dto/create-base-entity.dto';
import { UpdateBaseEntityDto } from '@app/domains/base-entity/dto/update-base-entity.dto';
import { GetAllBaseEntitiesQuery } from '@app/domains/base-entity/queries/impl/get-all-base-entities.query';
import { GetBaseEntityByIdQuery } from '@app/domains/base-entity/queries/impl/get-base-entity-by-id.query';

@Injectable()
export class BaseEntityService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async createBaseEntity(createBaseEntityDto: CreateBaseEntityDto) {
    try {
      return await this.commandBus.execute(new CreateBaseEntityCommand(createBaseEntityDto));
    } catch (error) {
      console.log('BaseEntityService createBaseEntity',error);
      throw new InternalServerErrorException('Failed to create base entity', error);
    }
  }

  async updateBaseEntity(id: string, updateBaseEntityDto: UpdateBaseEntityDto) {
    try {
      const baseEntity = await this.commandBus.execute(new UpdateBaseEntityCommand(id, updateBaseEntityDto));
      if (!baseEntity) {
        throw new NotFoundException('Base entity not found');
      }
      return baseEntity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log('BaseEntityService getAllActivities',error);
        throw error;
      }
      console.log('BaseEntityService updateBaseEntity',error);
      throw new InternalServerErrorException('Failed to update base entity', error);
    }
  }

  async deleteBaseEntity(id: string) {
    try {
      const baseEntity = await this.commandBus.execute(new DeleteBaseEntityCommand(id));
      if (!baseEntity) {
        throw new NotFoundException('Base entity not found');
      }
      return baseEntity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log('BaseEntityService getAllActivities',error);
        throw error;
      }
      console.log('BaseEntityService deleteBaseEntity',error);
      throw new InternalServerErrorException('Failed to delete base entity', error);
    }
  }

  async getBaseEntityById(id: string) {
    try {
      const baseEntity = await this.queryBus.execute(new GetBaseEntityByIdQuery(id));
      if (!baseEntity) {
        throw new NotFoundException('Base entity not found');
      }
      return baseEntity;
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log('BaseEntityService getAllActivities',error);
        throw error;
      }
      console.log('BaseEntityService getBaseEntityById',error);
      throw new InternalServerErrorException('Failed to retrieve base entity', error);
    }
  }

  async getAllBaseEntities(limit = 10, page = 1) {
    try {
      return await this.queryBus.execute(new GetAllBaseEntitiesQuery(limit, page));
    } catch (error) {
      console.log('BaseEntityService getAllBaseEntities',error);
      throw new InternalServerErrorException('Failed to retrieve base entities', error);
    }
  }
}