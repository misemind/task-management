import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type IssueDocument = Issue & Document;

@Schema()
export class FieldValue {
  @Prop({ type: Types.ObjectId, ref: 'Field', required: true })
  fieldId: Types.ObjectId;  // Reference to the field

  @Prop({ type: SchemaTypes.Mixed, required: true })
  value: any;  // Explicitly telling Mongoose to allow any type for this field

  @Prop({ type: String, required: true })
  type: string; 
}

const FieldValueSchema = SchemaFactory.createForClass(FieldValue);

@Schema()
export class Issue {
  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'IssueType', required: true })
  issueTypeId: Types.ObjectId;

  @Prop({ type: [{ type: FieldValueSchema }], required: true })
  fieldValues: FieldValue[];
}

export const IssueSchema = SchemaFactory.createForClass(Issue);