import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from '@app/domains/comment/commands/impl/create-comment.command';
import { DeleteCommentCommand } from '@app/domains/comment/commands/impl/delete-comment.command';
import { UpdateCommentCommand } from '@app/domains/comment/commands/impl/update-comment.command';
import { CreateCommentDto } from '@app/domains/comment/dto/create-comment.dto';
import { UpdateCommentDto } from '@app/domains/comment/dto/update-comment.dto';
import { GetCommentsByProjectIdQuery } from '@app/domains/comment/queries/impl/get-comments-by-project-id.query';


@Injectable()
export class CommentService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  async createComment(projectId: string, userId: string, createCommentDto: CreateCommentDto) {
    const { content, parentId,files } = createCommentDto;
    return this.commandBus.execute(
      new CreateCommentCommand(
        projectId,
        userId,
        content,
        parentId ? parentId : null,
        files
      ),
    );
  }

  async updateComment(id: string, updateCommentDto: UpdateCommentDto) {
    const { content } = updateCommentDto;
    return this.commandBus.execute(
      new UpdateCommentCommand(id, content),
    );
  }

  async deleteComment(id: string) {
    return this.commandBus.execute(
      new DeleteCommentCommand(id),
    );
  }

  async getCommentsByProjectId(projectId: string, limit: number = 10, page: number = 1) {
    return this.queryBus.execute(
      new GetCommentsByProjectIdQuery(projectId, limit, page),
    );
  }
}