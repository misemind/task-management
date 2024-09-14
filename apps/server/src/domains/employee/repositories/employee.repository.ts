import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from '@app/domains/employee/entities/employee.entity';
import { CreateEmployeeDto } from '@app/domains/employee/dto/create-employee.dto';
import { UpdateEmployeeDto } from '@app/domains/employee/dto/update-employee.dto';
@Injectable()
export class EmployeeRepository {
  constructor(@InjectModel(Employee.name) private readonly employeeModel: Model<EmployeeDocument>) { }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const newEmployee = new this.employeeModel(createEmployeeDto);
    return newEmployee.save();
  }

  async findById(id: string): Promise<Employee | null> {
    return this.employeeModel.findById(id).exec();
  }

  async findAll(limit: number, skip: number): Promise<Employee[]> {
    return this.employeeModel.find().skip(skip).limit(limit).exec();
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee | null> {
    const updatedFields: Partial<Employee> = {
      firstName: updateEmployeeDto.firstName,
      lastName: updateEmployeeDto.lastName,
      phoneNumber: updateEmployeeDto.phoneNumber,
      emailAddress: updateEmployeeDto.emailAddress,
      joiningDate: updateEmployeeDto.joiningDate,
      skills: updateEmployeeDto.skills,
      designation: updateEmployeeDto.designation,
      website: updateEmployeeDto.website,
      city: updateEmployeeDto.city,
      country: updateEmployeeDto.country,
      zipCode: updateEmployeeDto.zipCode,
      description: updateEmployeeDto.description,
      profileCompletion: updateEmployeeDto.profileCompletion,
      socialLinks: updateEmployeeDto.socialLinks,
      passwordHash: updateEmployeeDto.passwordHash,
      projectNumber: updateEmployeeDto.projectNumber,
      taskNumber: updateEmployeeDto.taskNumber,
      profileImagePath: updateEmployeeDto.profileImagePath,
      coverImagePath: updateEmployeeDto.coverImagePath,
    };
    return this.employeeModel.findOneAndUpdate({ _id: id }, updatedFields, { new: true }).exec();
  }

  async delete(id: string): Promise<Employee | null> {
    return this.employeeModel.findByIdAndDelete(id).exec();
  }
  async findDefaultUser(): Promise<Employee | null> {
    const count = await this.employeeModel.countDocuments().exec();
    const random = Math.floor(Math.random() * count);
    return this.employeeModel.findOne().skip(random).exec();
  }

  async countEmployees(): Promise<number> {
    return this.employeeModel.countDocuments().exec();
  }
  
}
