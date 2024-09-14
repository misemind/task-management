import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SecuritySettingsDocument = SecuritySettings & Document;

@Schema()
export class SecuritySettings {

  @Prop({ required: true })
  twoFactorAuthentication: boolean;

  @Prop({ required: true })
  secondaryVerification: string;

  @Prop({ required: true })
  backupCodes: boolean;

  @Prop({ required: true })
  directMessages: boolean;

  @Prop({ required: true })
  desktopNotifications: boolean;

  @Prop({ required: true })
  emailNotifications: boolean;

  @Prop({ required: true })
  chatNotifications: boolean;

  @Prop({ required: true })
  purchaseNotifications: boolean
}

export const SecuritySettingsSchema = SchemaFactory.createForClass(SecuritySettings);