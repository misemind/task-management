import { CreateEmployeeExperienceHandler } from "./handlers/create-employee-experience.handler";
import { DeleteEmployeeExperienceHandler } from "./handlers/delete-employee-experience.handler";
import { UpdateEmployeeExperienceHandler } from "./handlers/update-employee-experience.handler";

export const EmployeeExperienceCommandsHandler=[
    CreateEmployeeExperienceHandler,
    UpdateEmployeeExperienceHandler,
    DeleteEmployeeExperienceHandler,
]