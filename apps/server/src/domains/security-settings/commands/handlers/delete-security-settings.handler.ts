import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecuritySettingsRepository } from '@app/domains/security-settings/repositories/security-settings.repository';
import { DeleteSecuritySettingsCommand } from '@app/domains/security-settings/commands/impl/delete-security-settings.command';
import { SecuritySettings } from '@app/domains/security-settings/entities/security-settings.entity';

@CommandHandler(DeleteSecuritySettingsCommand)
export class DeleteSecuritySettingsHandler implements ICommandHandler<DeleteSecuritySettingsCommand> {
  constructor(private readonly securitySettingsRepository: SecuritySettingsRepository) {}

  async execute(command: DeleteSecuritySettingsCommand): Promise<SecuritySettings | null> {
    return this.securitySettingsRepository.delete(command.id);
  }
}