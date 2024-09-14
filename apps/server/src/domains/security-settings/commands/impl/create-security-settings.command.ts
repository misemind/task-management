import { ICommand } from '@nestjs/cqrs';
import { CreateSecuritySettingsDto } from '@app/domains/security-settings/dto/create-security-settings.dto';

export class CreateSecuritySettingsCommand implements ICommand {
  constructor(public readonly createSecuritySettingsDto: CreateSecuritySettingsDto) {}
}