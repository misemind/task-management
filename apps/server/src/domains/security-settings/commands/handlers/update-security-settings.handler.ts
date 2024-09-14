import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecuritySettingsRepository } from '@app/domains/security-settings/repositories/security-settings.repository';
import { UpdateSecuritySettingsCommand } from '@app/domains/security-settings/commands/impl/update-security-settings.command';
import { SecuritySettings } from '@app/domains/security-settings/entities/security-settings.entity';

@CommandHandler(UpdateSecuritySettingsCommand)
export class UpdateSecuritySettingsHandler implements ICommandHandler<UpdateSecuritySettingsCommand> {
  constructor(private readonly securitySettingsRepository: SecuritySettingsRepository) {}

  async execute(command: UpdateSecuritySettingsCommand): Promise<SecuritySettings | null> {
    return this.securitySettingsRepository.update(command.id, command.updateSecuritySettingsDto);
  }
}