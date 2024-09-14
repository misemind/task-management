import { Module } from '@nestjs/common';
import { Logger } from './logger.service';
import { WinstonConfigService } from './winston-config.service';

@Module({
  providers: [Logger, WinstonConfigService],
  exports: [Logger],
})
export class LoggerModule {}
