import { CreateEmployeeDocumentHandler } from './handlers/create-employee-document.handler';
import { UpdateEmployeeDocumentHandler } from './handlers/update-employee-document.handler';
import { DeleteEmployeeDocumentHandler } from './handlers/delete-employee-document.handler';
import { DownloadEmployeeDocumentHandler } from './handlers/download-employee-document.handler';

export const EmployeeDocumentCommandHandlers = [
  CreateEmployeeDocumentHandler,
  UpdateEmployeeDocumentHandler,
  DeleteEmployeeDocumentHandler,
  DownloadEmployeeDocumentHandler,
];
