import { GetEmployeeDocumentsHandler } from './handlers/get-employee-documents.handler';
import { GetTotalEmployeeDocumentsCountHandler } from './handlers/get-total-employee-documents-count.handler';

export const EmployeeDocumentQueryHandlers = [
  GetEmployeeDocumentsHandler,
  GetTotalEmployeeDocumentsCountHandler
];
