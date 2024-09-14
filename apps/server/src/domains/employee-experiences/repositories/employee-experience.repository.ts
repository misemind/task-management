import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEmployeeExperienceDto } from '@app/domains/employee-experiences/dto/create-employee-experience.dto';
import { UpdateEmployeeExperienceDto } from '@app/domains/employee-experiences/dto/update-employee-experience.dto';
import { EmployeeExperience, EmployeeExperienceDocument } from '@app/domains/employee-experiences/entities/employee-experience.entity';

@Injectable()
export class EmployeeExperienceRepository {
  constructor(
    @InjectModel(EmployeeExperience.name) private readonly employeeExperienceModel: Model<EmployeeExperienceDocument>,
  ) {}

  async create(createEmployeeExperienceDto: CreateEmployeeExperienceDto): Promise<EmployeeExperience> {
    const newExperience = new this.employeeExperienceModel(createEmployeeExperienceDto);
    return newExperience.save();
  }

  async findById(id: string): Promise<EmployeeExperience | null> {
    return this.employeeExperienceModel.findById(id).exec();
  }

  async findByEmployeeId(employee_id: string): Promise<EmployeeExperience[]> {
    return this.employeeExperienceModel.find({ employee_id }).exec();
  }

  async update(id: string, updateEmployeeExperienceDto: UpdateEmployeeExperienceDto): Promise<EmployeeExperience | null> {
    return this.employeeExperienceModel.findByIdAndUpdate(id, updateEmployeeExperienceDto, { new: true }).exec();
  }

  async delete(id: string): Promise<EmployeeExperience | null> {
    return this.employeeExperienceModel.findByIdAndDelete(id).exec();
  }
}
