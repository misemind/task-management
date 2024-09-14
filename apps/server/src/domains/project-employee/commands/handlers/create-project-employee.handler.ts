import { EmployeeRepository } from "@app/domains/employee/repositories/employee.repository";
import { ProjectRepository } from "@app/domains/project/repositories/project.repository";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { Schema, Types } from "mongoose";
import { ProjectEmployee } from "@app/domains/project-employee/entities/project-employee.entity";
import { ProjectEmployeeRepository } from "../../repositories/project-employee.repository";
import { CreateProjectEmployeeCommand } from "../impl/create-project-employee.command";

@CommandHandler(CreateProjectEmployeeCommand)
export class CreateProjectEmployeeHandler implements ICommandHandler<CreateProjectEmployeeCommand> {
  constructor(
    private readonly projectEmployeeRepository: ProjectEmployeeRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(command: CreateProjectEmployeeCommand): Promise<ProjectEmployee> {
    const { createProjectEmployeeDto } = command;

    const employeeId = createProjectEmployeeDto.employeeId;
    const projectId = createProjectEmployeeDto.projectId;

    const employee = await this.employeeRepository.findById(employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const existingAssignment = await this.projectEmployeeRepository.findByEmployeeAndProject(employeeId, projectId);
    if (existingAssignment) {
      throw new BadRequestException('Employee is already assigned to this project');
    }

    const projectEmployee = await this.projectEmployeeRepository.create(createProjectEmployeeDto);

    // Update the employee and project documents with the assignment
    employee.projectNumber += 1;
    employee.projects.push(new Types.ObjectId(projectId));  // Push the projectId as ObjectId

    project.employeeCount += 1;
    project.employees.push(employeeId);  // Push the employeeId as ObjectId

    await this.employeeRepository.update(employee._id.toString(), employee);
    await this.projectRepository.update(project._id.toString(), project);

    return projectEmployee;
  }
}
