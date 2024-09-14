import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BoardDocument = Board & Document;

@Schema()
export class Board {
  _id?: string;

  @Prop({ required: true })
  boardName: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);