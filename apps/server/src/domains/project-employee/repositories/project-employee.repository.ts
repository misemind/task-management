import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectEmployee, ProjectEmployeeDocument } from '@app/domains/project-employee/entities/project-employee.entity';
import { CreateProjectEmployeeDto } from '@app/domains/project-employee/dto/create-project-employee.dto';

@Injectable()
export class ProjectEmployeeRepository {
  constructor(@InjectModel(ProjectEmployee.name) private readonly projectEmployeeModel: Model<ProjectEmployeeDocument>) { }

  async create(createProjectEmployeeDto: CreateProjectEmployeeDto): Promise<ProjectEmployee> {
    const newProjectEmployee = new this.projectEmployeeModel(createProjectEmployeeDto);
    return newProjectEmployee.save();
  }

  async findById(id: string): Promise<ProjectEmployee | null> {
    return this.projectEmployeeModel.findById(id).exec();
  }

  async findByEmployeeAndProject(employeeId: string, projectId: string): Promise<ProjectEmployee | null> {
    return this.projectEmployeeModel.findOne({ employeeId: new Types.ObjectId(employeeId), projectId: new Types.ObjectId(projectId) }).exec();
  }


  async countByProjectId(projectId: string): Promise<number> {
    return this.projectEmployeeModel.countDocuments({ projectId: new Types.ObjectId(projectId) }).exec();
  }

  async countByEmployeeId(employeeId: string): Promise<number> {
    return this.projectEmployeeModel.countDocuments({ employeeId: new Types.ObjectId(employeeId) }).exec();
  }

  async findByProjectIdWithPagination(projectId: string, limit: number, skip: number): Promise<any[]> {
    return this.projectEmployeeModel.aggregate([
      { $match: { projectId: new Types.ObjectId(projectId) } },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee',
        },
      },
      { $unwind: '$employee' },
      { $skip: skip },
      { $limit: limit },
      {
        $replaceRoot: { newRoot: '$employee' } // This line replaces the root with the employee document
      }
    ]).exec();
  }

  async findByEmployeeIdWithPagination(employeeId: string, limit: number, skip: number): Promise<any[]> {
    return this.projectEmployeeModel.aggregate([
      { $match: { employeeId: new Types.ObjectId(employeeId) } },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'project',
        },
      },
      { $unwind: '$project' },
      {
        $lookup: {
          from: 'employees',
          let: { employeeIds: '$project.employees' }, // Reference the employees array in the project
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$employeeIds'] } } }, // Match employees whose _id is in the employees array
            {
              $project: {
                firstName: 1,
                lastName: 1,
                profileImagePath: 1
              }
            } // Only include necessary fields
          ],
          as: 'project.employees', // Add the resulting employees array to the project
        }
      },
      { $skip: skip },
      { $limit: limit },
      {
        $replaceRoot: { newRoot: '$project' } // Replace the root document with the project document
      }
    ]).exec();
  }
  async delete(id: string): Promise<ProjectEmployee | null> {
    return this.projectEmployeeModel.findByIdAndDelete(id).exec();
  }
}
