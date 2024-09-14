import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFieldCommand } from '../commands/impl/create-field.command';
import { DeleteFieldCommand } from '../commands/impl/delete-field.command';
import { UpdateFieldCommand } from '../commands/impl/update-field.command';
import { CreateFieldDto } from '../dto/create-field.dto';
import { UpdateFieldDto } from '../dto/update-field.dto';
import { GetFieldByIdQuery } from '../queries/impl/get-field-by-id.query';

@Injectable()
export class FieldService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async createField(createFieldDto: CreateFieldDto) {
    return this.commandBus.execute(new CreateFieldCommand(createFieldDto));
  }

  async updateField(id: string, updateFieldDto: UpdateFieldDto) {
    const field = await this.commandBus.execute(new UpdateFieldCommand(id, updateFieldDto));
    if (!field) {
      throw new NotFoundException('Field not found');
    }
    return field;
  }

  async deleteField(id: string) {
    const field = await this.commandBus.execute(new DeleteFieldCommand(id));
    if (!field) {
      throw new NotFoundException('Field not found');
    }
    return field;
  }

  async getFieldById(id: string) {
    const field = await this.queryBus.execute(new GetFieldByIdQuery(id));
    if (!field) {
      throw new NotFoundException('Field not found');
    }
    return field;
  }
}