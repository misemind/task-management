// apps/server/src/domains/comment/entities/comment.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;
@Schema({ timestamps: true })
export class Comment {

    _id?: string;

    @Prop({ type: String, ref: 'Project', required: true })
    projectId: string;

    @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
    userId: string;

    @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
    parentId: string;

    @Prop({ type: String, required: true })
    content: string;

    @Prop([{ type: Types.ObjectId, ref: 'Comment' }])
    replies: string[];

    @Prop([{ 
        url: { type: String, required: false },
        contentType: { type: String, required: false },
        size: { type: Number, required: false }
    }])
    files?: Array<{
        url: string;
        contentType: string;
        size: number;
    }>;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
