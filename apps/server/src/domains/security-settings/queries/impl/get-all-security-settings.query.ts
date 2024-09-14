import { IQuery } from '@nestjs/cqrs';

export class GetAllSecuritySettingsQuery implements IQuery {
  constructor(public readonly limit: number, public readonly page: number) {}
}