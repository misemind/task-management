import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board, BoardDocument } from '../entities/board.entity';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';

@Injectable()
export class BoardRepository {
  constructor(@InjectModel(Board.name) private readonly boardModel: Model<BoardDocument>) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const newBoard = new this.boardModel(createBoardDto);
    return newBoard.save();
  }

  async findById(id: string): Promise<Board | null> {
    const board = await this.boardModel.findById(id).exec();
    if (!board) {
      throw new NotFoundException(`Board not found with ID: ${id}`);
    }
    return board;
  }

  async findByProjectIdWithPagination(projectId: string, limit: number, skip: number): Promise<Board[]> {
    return this.boardModel.find({ projectId }).skip(skip).limit(limit).exec();
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<Board | null> {
    return this.boardModel.findByIdAndUpdate(id, updateBoardDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Board | null> {
    return this.boardModel.findByIdAndDelete(id).exec();
  }
}