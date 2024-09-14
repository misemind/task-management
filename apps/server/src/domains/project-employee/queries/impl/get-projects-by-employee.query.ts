import { IQuery } from '@nestjs/cqrs';

export class GetProjectsByEmployeeQuery implements IQuery {
  constructor(
    public readonly employeeId: string,
    public readonly limit: number,
    public readonly skip: number,
  ) {}
}