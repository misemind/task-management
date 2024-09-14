import { ICommand } from '@nestjs/cqrs';
import { UpdateSecuritySettingsDto } from '@app/domains/security-settings/dto/update-security-settings.dto';

export class UpdateSecuritySettingsCommand implements ICommand {
  constructor(public readonly id: string, public readonly updateSecuritySettingsDto: UpdateSecuritySettingsDto) {}
}