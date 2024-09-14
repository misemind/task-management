import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateSecuritySettingsCommand } from '@app/domains/security-settings/commands/impl/create-security-settings.command';
import { DeleteSecuritySettingsCommand } from '@app/domains/security-settings/commands/impl/delete-security-settings.command';
import { UpdateSecuritySettingsCommand } from '@app/domains/security-settings/commands/impl/update-security-settings.command';
import { CreateSecuritySettingsDto } from '@app/domains/security-settings/dto/create-security-settings.dto';
import { UpdateSecuritySettingsDto } from '@app/domains/security-settings/dto/update-security-settings.dto';
import { GetAllSecuritySettingsQuery } from '@app/domains/security-settings/queries/impl/get-all-security-settings.query';
import { GetSecuritySettingsByIdQuery } from '@app/domains/security-settings/queries/impl/get-security-settings-by-id.query';

@Injectable()
export class SecuritySettingsService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async createSecuritySettings(createSecuritySettingsDto: CreateSecuritySettingsDto) {
    try {
      return await this.commandBus.execute(new CreateSecuritySettingsCommand(createSecuritySettingsDto));
    } catch (error) {
      console.log('SecuritySettingsService createSecuritySettings',error);
      throw new InternalServerErrorException('Failed to create security settings', error);
    }
  }

  async updateSecuritySettings(id: string, updateSecuritySettingsDto: UpdateSecuritySettingsDto) {
    try {
      const securitySettings = await this.commandBus.execute(new UpdateSecuritySettingsCommand(id, updateSecuritySettingsDto));
      if (!securitySettings) {
        throw new NotFoundException('Security settings not found');
      }
      return securitySettings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log('SecuritySettingsService updateSecuritySettings',error);
        throw error;
      }
      console.log('SecuritySettingsService updateSecuritySettings',error);
      throw new InternalServerErrorException('Failed to update security settings', error);
    }
  }

  async deleteSecuritySettings(id: string) {
    try {
      const securitySettings = await this.commandBus.execute(new DeleteSecuritySettingsCommand(id));
      if (!securitySettings) {
        throw new NotFoundException('Security settings not found');
      }
      return securitySettings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log('SecuritySettingsService deleteSecuritySettings',error);
        throw error;
      }
      console.log('SecuritySettingsService getProjectById',error);
      throw new InternalServerErrorException('Failed to delete security settings', error);
    }
  }

  async getSecuritySettingsById(id: string) {
    try {
      const securitySettings = await this.queryBus.execute(new GetSecuritySettingsByIdQuery(id));
      if (!securitySettings) {
        throw new NotFoundException('Security settings not found');
      }
      return securitySettings;
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log('SecuritySettingsService getSecuritySettingsById',error);
        throw error;
      }
      console.log('SecuritySettingsService getSecuritySettingsById',error);
      throw new InternalServerErrorException('Failed to retrieve security settings', error);
    }
  }

  async getAllSecuritySettings(limit = 10, page = 1) {
    try {
      return await this.queryBus.execute(new GetAllSecuritySettingsQuery(limit, page));
    } catch (error) {
      console.log('SecuritySettingsService getAllSecuritySettings',error);
      throw new InternalServerErrorException('Failed to retrieve security settings', error);
    }
  }
}