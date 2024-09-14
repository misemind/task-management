import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { SecuritySettingsService } from './services/security-settings.service';
import { SecuritySettings, SecuritySettingsSchema } from './entities/security-settings.entity';
import { SecuritySettingsRepository } from './repositories/security-settings.repository';
import { SecuritySettingsCommandHandlers } from './commands';
import { SecuritySettingsQueryHandlers } from './queries';
import { SecuritySettingsController } from './controllers/security-settings.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SecuritySettings.name, schema: SecuritySettingsSchema }]),
    CqrsModule,
  ],
  providers: [SecuritySettingsService, SecuritySettingsRepository, ...SecuritySettingsCommandHandlers, ...SecuritySettingsQueryHandlers],
  controllers:[SecuritySettingsController]
})
export class SecuritySettingsModule {}