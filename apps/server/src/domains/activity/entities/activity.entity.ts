import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ActivityDocument = Activity & Document;

@Schema()
export class Activity {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'BaseEntity', required: true })
  project_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, enum: ['Task', 'Comment', 'File Upload', 'Ticket', 'Event', 'Project'] })
  activityType: string;

  @Prop({ required: true })
  activityTitle: string;

  @Prop()
  activityDescription: string;

  @Prop({ required: true, enum: ['New', 'In Progress', 'Completed', 'Out of Delivery'], default: 'New' })
  status: string;

  @Prop({ required: true, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' })
  priority: string;

  @Prop()
  dueDate: Date;

  @Prop({ type: [{ fileUrl: String, fileName: String, fileSize: Number, fileType: String, createdAt: Date }], default: [] })
  attachments: any[];

  @Prop({ type: [{ employeeId: MongooseSchema.Types.ObjectId, commentText: String, createdAt: Date }], default: [] })
  comments: any[];

  @Prop({ type: [{ employeeId: MongooseSchema.Types.ObjectId, notificationMessage: String, isRead: Boolean, createdAt: Date }], default: [] })
  notifications: any[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);