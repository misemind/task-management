import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { FieldController } from './controllers/field.controller';
import { FieldService } from './services/field.service';
import { Field, FieldSchema } from './entities/field.entity';
import { FieldCommandHandlers } from './commands';
import { FieldQueryHandlers } from './queries';
import { FieldRepository } from './repositories/field.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Field.name, schema: FieldSchema }]),
    CqrsModule,
  ],
  providers: [FieldService, FieldRepository, ...FieldCommandHandlers, ...FieldQueryHandlers],
  controllers: [FieldController],
  exports: [FieldService, FieldRepository],
})
export class FieldModule {}