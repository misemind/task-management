// apps/server/src/domains/employee/entities/employee.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Project } from '@app/domains/project/entities/project.entity';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {

  _id?: string;

  @Prop({ required: true })
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  emailAddress: string;

  @Prop()
  joiningDate: Date;

  @Prop()
  skills: string[];

  @Prop({ required: true })
  designation: string;

  @Prop()
  website: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  zipCode: string;

  @Prop()
  description: string;

  @Prop()
  profileCompletion: number;

  @Prop([String])
  socialLinks: string[];

  @Prop()
  passwordHash: string;

  @Prop({ required: true, default: 0 })
  projectNumber: number;  // Tracks the number of projects an employee is associated with

  @Prop({ required: true, default: 0 })
  taskNumber: number;

  @Prop()
  profileImagePath: string;

  @Prop()
  coverImagePath: string;
  @Prop({
    type: [Types.ObjectId],
    ref: Project.name,
    default: [],
  })
  projects: Types.ObjectId[];
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
