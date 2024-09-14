import { ICommand } from '@nestjs/cqrs';
export class CreateCommentCommand implements ICommand {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
    public readonly content: string,
    public readonly parentId?: string,
    public readonly files?: Array<{
      url: string;
      contentType: string;
      size: number;
    }>,
  ) {}
}