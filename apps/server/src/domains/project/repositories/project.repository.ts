import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CreateProjectDto } from "@app/domains/project/dto/create-project.dto";
import { Project, ProjectDocument } from "../entities/project.entity";
import mongoose, { Model } from "mongoose";
import { UpdateProjectDto } from "../dto/update-project.dto";



@Injectable()
export class ProjectRepository {
  constructor(@InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>) { }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const newProject = new this.projectModel(createProjectDto);
    return newProject.save();
  }

  async findById(id: string): Promise<Project> {
    const [project] = await this.projectModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } }, // Match by project ID
      {
        $lookup: {
          from: 'projectemployees',
          localField: '_id',
          foreignField: 'projectId',
          as: 'employeeAssignments',
        },
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeAssignments.employeeId',
          foreignField: '_id',
          as: 'employees',
        },
      },
      {
        $addFields: {
          employees: {
            $map: {
              input: '$employees',
              as: 'employee',
              in: {
                _id: '$$employee._id',
                firstName: '$$employee.firstName',
                lastName: '$$employee.lastName',
                profileImagePath: '$$employee.profileImagePath',
              },
            },
          },
        },
      },
      { $unset: 'employeeAssignments' }, // Optionally remove employeeAssignments field
    ]).exec();

    if (!project) {
      throw new NotFoundException(`Project not found with ID: ${id}`);
    }

    return project;
  }

  async findAll(limit: number, skip: number): Promise<Project[]> {
    return this.projectModel.find().skip(skip).limit(limit).exec();
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project | null> {
    const updatedFields: Partial<Project> = {
      title: updateProjectDto.title,
      description: updateProjectDto.description,
      priority: updateProjectDto.priority,
      status: updateProjectDto.status,
      endDate: updateProjectDto.endDate,
      startDate: updateProjectDto.startDate,
      privacy: updateProjectDto.privacy,
      category: updateProjectDto.category,
      thumbnailImage: updateProjectDto.thumbnailImage,
      tags: updateProjectDto.tags,
      teamLead: updateProjectDto.teamLead,
      skills: updateProjectDto.skills,
      updated: new Date(),  // Assuming you want to update the updated field automatically
      employees: updateProjectDto.employees,
      commentIds: updateProjectDto.commentIds,
      employeeCount: updateProjectDto.employees?.length || 0, // Update employee count based on the number of employees
    };

    return this.projectModel.findOneAndUpdate({ _id: id }, updatedFields, { new: true }).exec();
  }

  async delete(id: string): Promise<Project | null> {
    return this.projectModel.findByIdAndDelete(id).exec();
  }

  async getProjectsWithEmployeeDetails(limit: number, skip: number): Promise<any[]> {
    return this.projectModel.aggregate([
      {
        $lookup: {
          from: 'projectemployees', // Collection name where project-employee relationships are stored
          localField: '_id',
          foreignField: 'projectId',
          as: 'employeeAssignments'
        }
      },
      {
        $lookup: {
          from: 'employees', // Collection name where employee details are stored
          localField: 'employeeAssignments.employeeId',
          foreignField: '_id',
          as: 'employees'
        }
      },
      {
        $addFields: {
          employees: {
            $map: {
              input: '$employees',
              as: 'employee',
              in: {
                _id: '$$employee._id',
                firstName: '$$employee.firstName',
                lastName: '$$employee.lastName',
                profileImagePath: '$$employee.profileImagePath',
              }
            }
          }
        }
      },
      {
        $unset: 'employeeAssignments', // Remove the employeeAssignments field if not needed
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]).exec();
  }
  async countProjects(): Promise<number> {
    return this.projectModel.countDocuments().exec();
  }

}
