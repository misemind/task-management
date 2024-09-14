import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransientFileDocument = TransientFile & Document;

@Schema({ timestamps: true })
export class TransientFile {
  @Prop({ required: true })
  filePath: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  isSubmitted: boolean;
}

export const TransientFileSchema = SchemaFactory.createForClass(TransientFile);
