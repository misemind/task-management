import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocumentDocument = ProjectDocument & Document;

@Schema()
export class ProjectDocument {
  _id?: string;

  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true, default: Date.now })
  uploadDate: Date;
}

export const ProjectDocumentSchema = SchemaFactory.createForClass(ProjectDocument);