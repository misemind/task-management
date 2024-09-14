// apps/server/src/domains/activity/dto/create-activity.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AttachmentDto {
  @ApiProperty({ description: 'URL of the file' })
  @IsString()
  @IsNotEmpty()
  readonly fileUrl: string;

  @ApiProperty({ description: 'Name of the file' })
  @IsString()
  @IsNotEmpty()
  readonly fileName: string;

  @ApiProperty({ description: 'Size of the file in bytes' })
  @IsOptional()
  readonly fileSize?: number;

  @ApiProperty({ description: 'Type of the file (e.g., Image, Document, Video)' })
  @IsString()
  @IsNotEmpty()
  readonly fileType: string;

  @ApiProperty({ description: 'Date when the file was created' })
  @IsDate()
  @IsOptional()
  readonly createdAt?: Date;
}

class CommentDto {
  @ApiProperty({ description: 'ID of the employee who made the comment' })
  @IsString()
  @IsNotEmpty()
  readonly employeeId: string;

  @ApiProperty({ description: 'Text of the comment' })
  @IsString()
  @IsNotEmpty()
  readonly commentText: string;

  @ApiProperty({ description: 'Date when the comment was created' })
  @IsDate()
  @IsOptional()
  readonly createdAt?: Date;
}

class NotificationDto {
  @ApiProperty({ description: 'ID of the employee who received the notification' })
  @IsString()
  @IsNotEmpty()
  readonly employeeId: string;

  @ApiProperty({ description: 'Notification message' })
  @IsString()
  @IsNotEmpty()
  readonly notificationMessage: string;

  @ApiProperty({ description: 'Whether the notification has been read' })
  @IsOptional()
  readonly isRead?: boolean;

  @ApiProperty({ description: 'Date when the notification was created' })
  @IsDate()
  @IsOptional()
  readonly createdAt?: Date;
}

export class CreateActivityDto {
  @ApiProperty({ description: 'Reference to the BaseEntity' })
  @IsString()
  @IsNotEmpty()
  readonly project_id: string;

  @ApiProperty({ description: 'Type of the activity (e.g., Task, Comment, File Upload)' })
  @IsEnum(['Task', 'Comment', 'File Upload', 'Ticket', 'Event', 'Project'])
  readonly activityType: string;

  @ApiProperty({ description: 'Title of the activity' })
  @IsString()
  @IsNotEmpty()
  readonly activityTitle: string;

  @ApiProperty({ description: 'Description of the activity' })
  @IsString()
  @IsOptional()
  readonly activityDescription?: string;

  @ApiProperty({ description: 'Status of the activity' })
  @IsEnum(['New', 'In Progress', 'Completed', 'Out of Delivery'])
  readonly status: string;

  @ApiProperty({ description: 'Priority of the activity' })
  @IsEnum(['Low', 'Medium', 'High', 'Critical'])
  readonly priority: string;

  @ApiProperty({ description: 'Due date of the activity' })
  @IsDate()
  @IsOptional()
  readonly dueDate?: Date;

  @ApiProperty({ description: 'List of attachments' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @IsOptional()
  readonly attachments?: AttachmentDto[];

  @ApiProperty({ description: 'List of comments' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  @IsOptional()
  readonly comments?: CommentDto[];

  @ApiProperty({ description: 'List of notifications' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationDto)
  @IsOptional()
  readonly notifications?: NotificationDto[];
}
