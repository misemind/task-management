import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Field, FieldDocument } from '../entities/field.entity';
import { CreateFieldDto } from '../dto/create-field.dto';
import { UpdateFieldDto } from '../dto/update-field.dto';

@Injectable()
export class FieldRepository {
  constructor(@InjectModel(Field.name) private readonly fieldModel: Model<FieldDocument>) {}

  async create(createFieldDto: CreateFieldDto): Promise<Field> {
    const newField = new this.fieldModel(createFieldDto);
    return newField.save();
  }

  async findById(id: string): Promise<Field | null> {
    const field = await this.fieldModel.findById(id).exec();
    if (!field) {
      throw new NotFoundException(`Field not found with ID: ${id}`);
    }
    return field;
  }

  async update(id: string, updateFieldDto: UpdateFieldDto): Promise<Field | null> {
    return this.fieldModel.findByIdAndUpdate(id, updateFieldDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Field | null> {
    return this.fieldModel.findByIdAndDelete(id).exec();
  }
}