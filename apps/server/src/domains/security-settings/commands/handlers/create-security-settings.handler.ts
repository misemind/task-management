import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecuritySettingsRepository } from '@app/domains/security-settings/repositories/security-settings.repository';
import { SecuritySettings } from '@app/domains/security-settings/entities/security-settings.entity';
import { CreateSecuritySettingsCommand } from '@app/domains/security-settings/commands/impl/create-security-settings.command';

@CommandHandler(CreateSecuritySettingsCommand)
export class CreateSecuritySettingsHandler implements ICommandHandler<CreateSecuritySettingsCommand> {
  constructor(private readonly securitySettingsRepository: SecuritySettingsRepository) {}

  async execute(command: CreateSecuritySettingsCommand): Promise<SecuritySettings> {
    return this.securitySettingsRepository.create(command.createSecuritySettingsDto);
  }
}