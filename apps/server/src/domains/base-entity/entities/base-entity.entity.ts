import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BaseEntityDocument = BaseEntity & Document;

@Schema()
export class BaseEntity {
  @Prop({ required: true })
  entityType: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  entityId: MongooseSchema.Types.ObjectId;

  @Prop()
  name: string;
}

export const BaseEntitySchema = SchemaFactory.createForClass(BaseEntity);