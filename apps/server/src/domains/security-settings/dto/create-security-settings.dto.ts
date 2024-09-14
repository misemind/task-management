import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateSecuritySettingsDto {

  @ApiProperty({ description: 'Enable or disable two-factor authentication' })
  @IsBoolean()
  readonly twoFactorAuthentication: boolean;

  @ApiProperty({ description: 'The type of secondary verification (e.g., Email, SMS)' })
  @IsString()
  @IsNotEmpty()
  readonly secondaryVerification: string;

  @ApiProperty({ description: 'Whether backup codes are enabled' })
  @IsBoolean()
  readonly backupCodes: boolean;

  @ApiProperty({ description: 'Enable or disable direct messages notifications' })
  @IsBoolean()
  readonly directMessages: boolean;

  @ApiProperty({ description: 'Enable or disable desktop notifications' })
  @IsBoolean()
  readonly desktopNotifications: boolean;

  @ApiProperty({ description: 'Enable or disable email notifications' })
  @IsBoolean()
  readonly emailNotifications: boolean;

  @ApiProperty({ description: 'Enable or disable chat notifications' })
  @IsBoolean()
  readonly chatNotifications: boolean;

  @ApiProperty({ description: 'Enable or disable purchase notifications' })
  @IsBoolean()
  readonly purchaseNotifications: boolean;  
}
