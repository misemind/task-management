import { CreateProjectDocumentHandler } from './handlers/create-project-document.handler';
import { UpdateProjectDocumentHandler } from './handlers/update-project-document.handler';
import { DeleteProjectDocumentHandler } from './handlers/delete-project-document.handler';
import { DownloadProjectDocumentHandler } from './handlers/download-project-document.handler';

export const ProjectDocumentCommandHandlers = [
  CreateProjectDocumentHandler,
  UpdateProjectDocumentHandler,
  DeleteProjectDocumentHandler,
  DownloadProjectDocumentHandler,
];