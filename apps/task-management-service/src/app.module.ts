import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from '@your-org/common-modules';
@Module({
  imports: [SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
