// apps/server/src/domains/project/entities/project.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Employee } from '@app/domains/employee/entities/employee.entity';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  _id?: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  priority: string;

  @Prop()
  status: string;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  startDate: Date;

  @Prop({ required: true, default: () => new Date() }) 
  createDate: Date;

  @Prop()
  privacy: string;

  @Prop()
  category: string;

  @Prop()
  thumbnailImage: string;

  @Prop([String])
  tags: string[];

  @Prop()
  teamLead: string;

  @Prop()
  skills: string[];

  @Prop()
  updated: Date;

  @Prop({
    type: [Types.ObjectId],
    ref: 'Employee',
    default: [],
  })
  employees: string[] // Expose employees as strings, but store them as ObjectId in MongoDB

  @Prop({
    type: [Types.ObjectId],
    ref: 'Comment',
    default: [],
  })
  commentIds: string[];  // Array of Comment IDs as strings

  @Prop({ required: true, default: 0 })
  employeeCount: number;  // Tracks the number of employees associated with the project
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
