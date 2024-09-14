import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SecuritySettingsRepository } from '@app/domains/security-settings/repositories/security-settings.repository';
import { GetSecuritySettingsByIdQuery } from '@app/domains/security-settings/queries/impl/get-security-settings-by-id.query';
import { SecuritySettings } from '@app/domains/security-settings/entities/security-settings.entity';

@QueryHandler(GetSecuritySettingsByIdQuery)
export class GetSecuritySettingsByIdHandler implements IQueryHandler<GetSecuritySettingsByIdQuery> {
  constructor(private readonly securitySettingsRepository: SecuritySettingsRepository) {}

  async execute(query: GetSecuritySettingsByIdQuery): Promise<SecuritySettings | null> {
    return this.securitySettingsRepository.findById(query.id);
  }
}