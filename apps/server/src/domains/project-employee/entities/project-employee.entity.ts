import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Employee } from '@app/domains/employee/entities/employee.entity';
import { Project } from '@app/domains/project/entities/project.entity';

export type ProjectEmployeeDocument = ProjectEmployee & Document;

@Schema()
export class ProjectEmployee {
  _id?: string
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Employee.name,
    required: true,
    get: (v: Types.ObjectId) => v.toString(),  // Convert ObjectId to string
    set: (v: string) => new Types.ObjectId(v),  // Convert string to ObjectId
  })
  employeeId: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: Project.name,
    required: true,
    get: (v: Types.ObjectId) => v.toString(),  // Convert ObjectId to string
    set: (v: string) => new Types.ObjectId(v),  // Convert string to ObjectId
  })
  projectId: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  status: string;

  @Prop({ default: Date.now })
  assignedAt: Date;
}

export const ProjectEmployeeSchema = SchemaFactory.createForClass(ProjectEmployee);
