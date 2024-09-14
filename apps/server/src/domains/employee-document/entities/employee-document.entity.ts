// apps/server/src/domains/employee/entities/employee-document.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocumentDocument = EmployeeDocument & Document;

@Schema()
export class EmployeeDocument {
  _id?: string;

  @Prop({ required: true })
  employeeId: string;

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

export const EmployeeDocumentSchema = SchemaFactory.createForClass(EmployeeDocument);
