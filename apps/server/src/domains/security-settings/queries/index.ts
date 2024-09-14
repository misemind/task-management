import { GetAllSecuritySettingsHandler } from './handlers/get-all-security-settings.handler';
import { GetSecuritySettingsByIdHandler } from './handlers/get-security-settings-by-id.handler';

export const SecuritySettingsQueryHandlers = [
  GetAllSecuritySettingsHandler,
  GetSecuritySettingsByIdHandler,
];