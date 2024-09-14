import { setupWorker } from "msw/browser";
import { employeeHandlers } from "./handlers/employee";
import { activityHandlers } from "./handlers/activity";
import { employeeSkillHandlers } from "./handlers/employeeSkill";
import { portfolioHandlers } from "./handlers/portfolio";
import { projectHandlers } from "./handlers/project";
import { projectMemberHandlers } from "./handlers/projectMember";
import { skillHandlers } from "./handlers/skill";
import { suggestionHandlers } from "./handlers/suggestion";

// Import other handlers...

export const worker = setupWorker(
  ...employeeHandlers,
  ...portfolioHandlers,
  ...skillHandlers,
  ...employeeSkillHandlers,
  ...projectHandlers,
  ...projectMemberHandlers,
  ...activityHandlers,
  ...suggestionHandlers
);
