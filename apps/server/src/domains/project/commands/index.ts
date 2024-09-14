import { CreateProjectHandler } from "./handlers/create-project.handler";
import { DeleteProjectHandler } from "./handlers/delete-project.handler";
import { UpdateProjectHandler } from "./handlers/update-project.handler";

export const ProjectCommandHandlers=[
    CreateProjectHandler,
    DeleteProjectHandler,
    UpdateProjectHandler
]