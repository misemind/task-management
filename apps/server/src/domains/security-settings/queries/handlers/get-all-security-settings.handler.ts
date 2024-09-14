import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SecuritySettingsRepository } from '@app/domains/security-settings/repositories/security-settings.repository';
import { SecuritySettings } from '@app/domains/security-settings/entities/security-settings.entity';
import { GetAllSecuritySettingsQuery } from '@app/domains/security-settings/queries/impl/get-all-security-settings.query';

@QueryHandler(GetAllSecuritySettingsQuery)
export class GetAllSecuritySettingsHandler implements IQueryHandler<GetAllSecuritySettingsQuery> {
  constructor(private readonly securitySettingsRepository: SecuritySettingsRepository) {}

  async execute(query: GetAllSecuritySettingsQuery): Promise<SecuritySettings[]> {
    const { limit, page } = query;
    const skip = (page - 1) * limit;
    return this.securitySettingsRepository.findAll(limit, skip);
  }
}