
import { ActivityModule } from "./activity/activity.module";
import { BaseEntityModule } from "./base-entity/base-entity.module";
import { EmployeeExperienceModule } from "./employee-experiences/employee-experience.module";
import { CommentModule } from "./comment/comment.module";
import { EmployeeModule } from "./employee/employee.module";

import { ProjectModule } from "./project/project.module";
import { SecuritySettingsModule } from "./security-settings/security-settings.module";
import { SkillModule } from "./skill/skill.module";
import { TransientFileModule } from "./transient-files/transient-file.module";
import { EmployeeDocumentModule } from "./employee-document/employee-document.module";
import { ProjectDocumentModule } from "./project-document/project-document.module";
import { ProjectEmployeeModule } from "./project-employee/project-employee.module";
import { BoardModule } from "./board/board.module";
import { SprintModule } from "./sprint/sprint.module";
import { IssueModule } from "./issue/issue.module";
import { IssueTypeModule } from "./issue-type/issue-type.module";
import { FieldModule } from "./field/field.module";

export const AllDomains = [
  ProjectModule.forRoot({
    sourceBucket: 'transient-files',
    sourceEntityFolder: 'projects',
    destinationBucket: 'documents',
    destinationEntityFolder: 'projects',
  }),
  EmployeeModule.forRoot({
    sourceBucket: 'transient-files',
    sourceEntityFolder: 'employees',
    destinationBucket: 'documents',
    destinationEntityFolder: 'employees',
  }),
  CommentModule.forRoot({
    sourceBucket: 'transient-files',
    sourceEntityFolder: 'comments',
    destinationBucket: 'documents',
    destinationEntityFolder: 'comments',
  }),
  EmployeeExperienceModule,
  SkillModule,
  TransientFileModule,
  ActivityModule,
  BaseEntityModule,
  SecuritySettingsModule,
  EmployeeDocumentModule.forRoot({
    sourceBucket: 'transient-files',
    destinationBucket: 'documents',
    destinationEntityFolder: 'employees',
  }),
  ProjectDocumentModule.forRoot({
    sourceBucket: 'transient-files',
    destinationBucket: 'documents',
    destinationEntityFolder: 'projects',
  }),
  ProjectEmployeeModule,
  BoardModule,
  SprintModule, 
  IssueModule,
  IssueTypeModule, 
  FieldModule
]