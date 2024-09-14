import { IQuery } from '@nestjs/cqrs';

export class GetSecuritySettingsByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}