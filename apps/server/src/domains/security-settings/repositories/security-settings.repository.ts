import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecuritySettings, SecuritySettingsDocument } from '@app/domains/security-settings/entities/security-settings.entity';
import { CreateSecuritySettingsDto } from '@app/domains/security-settings/dto/create-security-settings.dto';
import { UpdateSecuritySettingsDto } from '@app/domains/security-settings/dto/update-security-settings.dto';

@Injectable()
export class SecuritySettingsRepository {
  constructor(@InjectModel(SecuritySettings.name) private readonly securitySettingsModel: Model<SecuritySettingsDocument>) {}

  async create(createSecuritySettingsDto: CreateSecuritySettingsDto): Promise<SecuritySettings> {
    const newSecuritySettings = new this.securitySettingsModel(createSecuritySettingsDto);
    return newSecuritySettings.save();
  }

  async findById(id: string): Promise<SecuritySettings | null> {
    return this.securitySettingsModel.findById(id).exec();
  }

  async findAll(limit: number, skip: number): Promise<SecuritySettings[]> {
    return this.securitySettingsModel.find().skip(skip).limit(limit).exec();
  }

  async update(id: string, updateSecuritySettingsDto: UpdateSecuritySettingsDto): Promise<SecuritySettings | null> {
    return this.securitySettingsModel.findByIdAndUpdate(id, updateSecuritySettingsDto, { new: true }).exec();
  }

  async delete(id: string): Promise<SecuritySettings | null> {
    return this.securitySettingsModel.findByIdAndDelete(id).exec();
  }
}