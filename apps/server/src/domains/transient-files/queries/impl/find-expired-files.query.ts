import { IQuery } from '@nestjs/cqrs';

export class FindExpiredFilesQuery implements IQuery {
    constructor(public readonly currentDate: Date) { }
}
