import { PartialType } from '@nestjs/mapped-types';
import { CreateSecuritySettingsDto } from './create-security-settings.dto';

export class UpdateSecuritySettingsDto extends PartialType(CreateSecuritySettingsDto) {}