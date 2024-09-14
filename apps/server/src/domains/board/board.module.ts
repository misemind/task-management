// ../apps/server/src/domains/board/board.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { BoardController } from './controllers/board.controller';
import { BoardService } from './services/board.service';
import { Board, BoardSchema } from './entities/board.entity';
import { BoardCommandHandlers } from './commands';
import { BoardQueryHandlers } from './queries';
import { BoardRepository } from './repositories/board.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }]),
    CqrsModule,
  ],
  providers: [BoardService, BoardRepository, ...BoardCommandHandlers, ...BoardQueryHandlers],
  controllers: [BoardController],
  exports: [BoardService, BoardRepository],
})
export class BoardModule {}
