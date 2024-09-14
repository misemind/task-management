import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FieldDocument = Field & Document;

@Schema()
export class Field {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  description: string;

  @Prop({ type: String, default: null })
  defaultValue: any;

  @Prop({ required: true, default: false })
  required: boolean;

  @Prop({ enum: ['default', 'custom'], required: true })
  fieldType: string;

  @Prop({ type: [{ value: String }] })
  options?: { value: string }[];
}

export const FieldSchema = SchemaFactory.createForClass(Field);