import { GetAllProjectsHandler } from "./handlers/get-all-projects.handler";
import { GetProjectByIdHandler } from "./handlers/get-project.handler";
import { GetTotalProjectsCountHandler } from "./handlers/get-total-projects-count.handler";

export const ProjectQueryHandlers=[
    GetAllProjectsHandler,
    GetProjectByIdHandler,
    GetTotalProjectsCountHandler
]