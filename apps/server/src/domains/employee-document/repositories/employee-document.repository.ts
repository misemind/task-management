import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateEmployeeDocumentDto } from '@app/domains/employee-document/dto/create-employee-document.dto';
import { UpdateEmployeeDocumentDto } from '@app/domains/employee-document/dto/update-employee-document.dto';
import { EmployeeDocument } from '@app/domains/employee-document/entities/employee-document.entity';

@Injectable()
export class EmployeeDocumentRepository {
  constructor(@InjectModel(EmployeeDocument.name) private readonly employeeDocumentModel: Model<EmployeeDocument>) {}

  async create(createEmployeeDocumentDto: CreateEmployeeDocumentDto): Promise<EmployeeDocument> {
    const newEmployeeDocument = new this.employeeDocumentModel(createEmployeeDocumentDto);
    return newEmployeeDocument.save();
  }

  async findById(id: string): Promise<EmployeeDocument | null> {
    return this.employeeDocumentModel.findById(id).exec();
  }

  async findAll(employeeId: string): Promise<EmployeeDocument[]> {
    return this.employeeDocumentModel.find({ employeeId }).exec();
  }

  async findAllWithPagination(employeeId: string, limit: number, skip: number): Promise<EmployeeDocument[]> {
    return this.employeeDocumentModel.find({ employeeId }).skip(skip).limit(limit).exec();
  }

  async update(id: string, updateEmployeeDocumentDto: UpdateEmployeeDocumentDto): Promise<EmployeeDocument | null> {
    return this.employeeDocumentModel.findByIdAndUpdate(id, updateEmployeeDocumentDto, { new: true }).exec();
  }

  async delete(id: string): Promise<EmployeeDocument | null> {
    return this.employeeDocumentModel.findByIdAndDelete(id).exec();
  }
  async countDocuments(employeeId: string): Promise<number> {
    return this.employeeDocumentModel.countDocuments({ employeeId }).exec();
  }
}