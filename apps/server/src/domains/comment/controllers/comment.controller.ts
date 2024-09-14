import { Controller, Post, Body, Param, Delete, Put, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CommentService } from '@app/domains/comment/services/comment.service';
import { CreateCommentDto } from '@app/domains/comment/dto/create-comment.dto';
import { UpdateCommentDto } from '@app/domains/comment/dto/update-comment.dto';

@ApiTags('Comments')
@Controller('api/projects/:projectId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Param('projectId') projectId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    //const userId = 'some-user-id'; // Replace this with actual user ID retrieval logic
    return this.commentService.createComment(projectId, null, createCommentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing comment' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(id, updateCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing comment' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async remove(@Param('id') id: string) {
    return this.commentService.deleteComment(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get comments by project ID' })
  @ApiResponse({ status: 200, description: 'The comments have been successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'No comments found for this project.' })
  async getComments(
    @Param('projectId') projectId: string,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,  // Accept page instead of skip
  ) {
    console.log(`Received request to fetch comments for project: ${projectId} with limit: ${limit} and page: ${page}`);
    return this.commentService.getCommentsByProjectId(projectId, limit, page);
  }
}