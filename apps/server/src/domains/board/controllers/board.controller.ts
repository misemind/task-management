import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBoardDto } from '@app/domains/board/dto/create-board.dto';
import { UpdateBoardDto } from '@app/domains/board/dto/update-board.dto';
import { BoardService } from '@app/domains/board/services/board.service';
import { PaginationDto } from '@app/domains/shared/dto/pagination.dto';

@ApiTags('Board')
@Controller('api/boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new board' })
  @ApiResponse({ status: 201, description: 'The board has been successfully created.' })
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.createBoard(createBoardDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a board by ID' })
  @ApiResponse({ status: 200, description: 'Return the board.' })
  @ApiResponse({ status: 404, description: 'Board not found.' })
  findOne(@Param('id') id: string) {
    return this.boardService.getBoardById(id);
  }

  @Get('/project/:project_id')
  @ApiOperation({ summary: 'Get boards by project ID with pagination' })
  @ApiResponse({ status: 200, description: 'Return the boards for a project.' })
  @ApiResponse({ status: 404, description: 'Boards not found for the project ID.' })
  findByProjectId(
    @Param('project_id') project_id: string,
    @Query() paginationDto: PaginationDto
  ) {
    return this.boardService.getBoardsByProjectId(project_id, paginationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a board by ID' })
  @ApiResponse({ status: 200, description: 'The board has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.updateBoard(id, updateBoardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a board by ID' })
  @ApiResponse({ status: 200, description: 'The board has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.boardService.deleteBoard(id);
  }
}