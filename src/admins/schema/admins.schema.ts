import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AdminRole } from './enums/admin-roles.enum';
import { AccountStatus } from 'src/auth/common/enums/account-status.enum';

@Schema({ timestamps: true, versionKey: false })
export class Admin {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: AccountStatus.VERIFIED })
  status: AccountStatus;

  @Prop({ required: Boolean, default: true })
  forcePasswordChange: boolean;

  @Prop({
    type: String,
    enum: AdminRole,
    default: AdminRole.ADMIN,
  })
  role: AdminRole;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Admin', required: false })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Admin', required: false })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date, required: false, default: null })
  deletedAt: Date | null;

  @Prop({ type: Types.ObjectId, ref: 'Admin', required: false })
  deletedBy: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export type AdminDocument = Admin & Document<Types.ObjectId>;
export const AdminSchema = SchemaFactory.createForClass(Admin);
