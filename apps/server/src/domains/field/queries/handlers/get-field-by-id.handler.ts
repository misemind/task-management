import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FieldRepository } from '@app/domains/field/repositories/field.repository';
import { GetFieldByIdQuery } from '@app/domains/field/queries/impl/get-field-by-id.query';
import { Field } from '@app/domains/field/entities/field.entity';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetFieldByIdQuery)
export class GetFieldByIdHandler implements IQueryHandler<GetFieldByIdQuery> {
  constructor(private readonly fieldRepository: FieldRepository) {}

  async execute(query: GetFieldByIdQuery): Promise<Field | null> {
    const field = await this.fieldRepository.findById(query.id);

    if (!field) {
      throw new NotFoundException(`Field not found with ID: ${query.id}`);
    }

    return field;
  }
}