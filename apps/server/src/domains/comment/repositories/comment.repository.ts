// apps/server/src/domains/comment/repositories/comment.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from '@app/domains/comment/entities/comment.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
  ) { }
  async create(commentData: Partial<Comment>): Promise<Comment | null> {
    const { projectId, userId, parentId, files, ...rest } = commentData;
  
    const newComment = new this.commentModel({
      ...rest,
      projectId,
      userId,
      parentId: parentId ? parentId : null,
      files, // Store the array of files
    });
  
    // Await the save operation
    await newComment.save();
  
    // Return the comment with the userId populated
    return this.commentModel.findById(newComment._id)
      .populate('userId') // Populate only the userId
      .lean()
      .exec();
  }
  async addReply(parentId: string, replyId: string): Promise<void> {
    await this.commentModel.updateOne(
      { _id: new Types.ObjectId(parentId) },
      { $push: { replies: new Types.ObjectId(replyId) } },
    ).exec();
  }

  async removeReply(parentId: string, replyId: string): Promise<void> {
    await this.commentModel.updateOne(
      { _id: new Types.ObjectId(parentId) },
      { $pull: { replies: new Types.ObjectId(replyId) } },
    ).exec();
  }

  async findById(id: string): Promise<Comment | null> {
    return this.commentModel.findById(new Types.ObjectId(id)).exec();
  }

  async update(id: string, updateData: Partial<Comment>): Promise<Comment | null> {
    return this.commentModel.findByIdAndUpdate(new Types.ObjectId(id), updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.commentModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  async findCommentsByProjectId(
    projectId: string,
    limit: number,
    skip: number
  ): Promise<CommentDocument[]> {
    const comments = await this.commentModel
      .find({ projectId, parentId: null })
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip(skip)
      .limit(limit)
      .populate('userId') // Populating userId
      .lean()
      .exec();

    for (let comment of comments) {
      comment.replies = await this.populateRepliesRecursive(comment.replies);
    }

    return comments;
  }

  // Method to recursively populate replies with userId
  private async populateRepliesRecursive(replyIds: string[]): Promise<any[]> {
    const replies = await this.commentModel
      .find({ _id: { $in: replyIds } })
      .populate('userId') // Populating userId for replies
      .lean()
      .exec();

    for (let reply of replies) {
      if (reply.replies.length > 0) {
        reply.replies = await this.populateRepliesRecursive(reply.replies);
      }
    }

    return replies;
  }









}
