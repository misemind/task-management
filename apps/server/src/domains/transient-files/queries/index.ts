import { FindExpiredFilesHandler } from './handlers/find-expired-files.handler';
import { GetAllTransientFilesHandler } from './handlers/get-all-transient-files.handler';
import { GetTransientFileByIdHandler } from './handlers/get-transient-file-by-id.handler';

export const TransientFileQueryHandlers = [
    GetTransientFileByIdHandler,
    GetAllTransientFilesHandler,
    FindExpiredFilesHandler,
];
