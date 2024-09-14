import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EmployeeExperience {
  @Prop({ type: String, required: true })
  employee_id: string;

  @Prop({ required: true })
  jobTitle: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  startYear: string;

  @Prop({ required: true })
  endYear: string;

  @Prop()
  jobDescription: string;
}

export type EmployeeExperienceDocument = EmployeeExperience & Document;
export const EmployeeExperienceSchema = SchemaFactory.createForClass(EmployeeExperience);
