import { CreateSecuritySettingsHandler } from './handlers/create-security-settings.handler';
import { DeleteSecuritySettingsHandler } from './handlers/delete-security-settings.handler';
import { UpdateSecuritySettingsHandler } from './handlers/update-security-settings.handler';

export const SecuritySettingsCommandHandlers = [
  CreateSecuritySettingsHandler,
  DeleteSecuritySettingsHandler,
  UpdateSecuritySettingsHandler,
];