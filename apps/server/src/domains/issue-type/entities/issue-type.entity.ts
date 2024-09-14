import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IssueTypeDocument = IssueType & Document;

@Schema()
export class Section {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  order: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Field' }] })
  fields: Types.ObjectId[];
}

const SectionSchema = SchemaFactory.createForClass(Section);

@Schema()
export class IssueType {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: SectionSchema }], required: true })
  sections: Section[];
}

export const IssueTypeSchema = SchemaFactory.createForClass(IssueType);