import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseEntity, BaseEntityDocument } from '@app/domains/base-entity/entities/base-entity.entity';
import { CreateBaseEntityDto } from '@app/domains/base-entity/dto/create-base-entity.dto';
import { UpdateBaseEntityDto } from '@app/domains/base-entity/dto/update-base-entity.dto';

@Injectable()
export class BaseEntityRepository {
  constructor(@InjectModel(BaseEntity.name) private readonly baseEntityModel: Model<BaseEntityDocument>) {}

  async create(createBaseEntityDto: CreateBaseEntityDto): Promise<BaseEntity> {
    const newBaseEntity = new this.baseEntityModel(createBaseEntityDto);
    return newBaseEntity.save();
  }

  async findById(id: string): Promise<BaseEntity | null> {
    return this.baseEntityModel.findById(id).exec();
  }

  async findAll(limit: number, skip: number): Promise<BaseEntity[]> {
    return this.baseEntityModel.find().skip(skip).limit(limit).exec();
  }

  async update(id: string, updateBaseEntityDto: UpdateBaseEntityDto): Promise<BaseEntity | null> {
    return this.baseEntityModel.findByIdAndUpdate(id, updateBaseEntityDto, { new: true }).exec();
  }

  async delete(id: string): Promise<BaseEntity | null> {
    return this.baseEntityModel.findByIdAndDelete(id).exec();
  }
}