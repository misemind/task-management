import { GetProjectDocumentsHandler } from './handlers/get-project-documents.handler';
import { GetTotalProjectDocumentsCountHandler } from './handlers/get-total-project-documents-count.handler';

export const ProjectDocumentQueryHandlers = [
  GetProjectDocumentsHandler,
  GetTotalProjectDocumentsCountHandler
];