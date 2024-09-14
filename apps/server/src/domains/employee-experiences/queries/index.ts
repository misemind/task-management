import { GetEmployeeExperienceByIdHandler } from "./handlers/get-employee-experience-by-id.handler"
import { GetEmployeeExperiencesHandler } from "./handlers/get-employee-experiences.handler"

export const EmployeeExperienceQueriesHandler=[
    GetEmployeeExperiencesHandler,
    GetEmployeeExperienceByIdHandler,
]