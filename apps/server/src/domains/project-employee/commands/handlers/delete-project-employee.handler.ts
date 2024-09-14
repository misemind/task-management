import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EmployeeRepository } from "@app/domains/employee/repositories/employee.repository";
import { ProjectRepository } from "@app/domains/project/repositories/project.repository";
import { ProjectEmployee } from "@app/domains/project-employee/entities/project-employee.entity";
import { ProjectEmployeeRepository } from "@app/domains/project-employee/repositories/project-employee.repository";
import { DeleteProjectEmployeeCommand } from "@app/domains/project-employee/commands/impl/delete-project-employee.command";

@CommandHandler(DeleteProjectEmployeeCommand)
export class DeleteProjectEmployeeHandler implements ICommandHandler<DeleteProjectEmployeeCommand> {
  constructor(
    private readonly projectEmployeeRepository: ProjectEmployeeRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly projectRepository: ProjectRepository,
  ) { }

  async execute(command: DeleteProjectEmployeeCommand): Promise<ProjectEmployee | null> {
    const { projectId, employeeId } = command;

    const projectEmployee = await this.projectEmployeeRepository.findByEmployeeAndProject(employeeId, projectId);
    if (!projectEmployee) {
      throw new NotFoundException('ProjectEmployee assignment not found');
    }

    const employee = await this.employeeRepository.findById(employeeId);
    const project = await this.projectRepository.findById(projectId);

    // Remove the assignment
    await this.projectEmployeeRepository.delete(projectEmployee._id.toString());

    // Update the employee and project documents after removal
    if (employee) {
      employee.projectNumber -= 1;
      employee.projects = employee.projects.filter(projId => projId.toString() !== projectId);
      await this.employeeRepository.update(employee._id.toString(), employee);
    }

    if (project) {
      project.employeeCount -= 1;
      project.employees = project.employees.filter(empId => empId.toString() !== employeeId);
      await this.projectRepository.update(project._id.toString(), project);
    }

    return projectEmployee;
  }
}
