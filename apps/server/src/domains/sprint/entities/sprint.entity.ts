import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SprintDocument = Sprint & Document;

@Schema()
export class Sprint {
  _id?: string;

  @Prop({ required: true })
  sprintName: string;

  @Prop({ type: Types.ObjectId, ref: 'Board', required: true })
  boardId: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  startDatetime: string;

  @Prop({ required: true })
  endDatetime: string;

  @Prop({ required: true })
  active: boolean;

  @Prop({ required: true })
  sprintGoal: string;
}

export const SprintSchema = SchemaFactory.createForClass(Sprint);