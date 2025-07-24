import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AccountStatus } from 'src/auth/common/enums/account-status.enum';
import { SignupMethod } from './enums/signup-method.enum';

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop()
  fullName: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ type: String, required: false, default: null })
  googleId: string | null;

  @Prop({
    type: String,
    enum: SignupMethod,
    default: SignupMethod.EMAIL,
  })
  signupMethod: SignupMethod;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  password: string | null;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  verificationCode: string | null;

  @Prop({ type: String, required: false, default: null })
  verificationCodeExpiry: Date | null;

  @Prop({
    type: String,
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  status: AccountStatus;

  @Prop({ type: String, required: false, default: null })
  refreshToken: string | null;

  @Prop({ type: Date, required: false, default: null })
  lastLogin: Date | null;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({
    type: Date,
    required: false,
    default: null,
  })
  deletedAt: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document<Types.ObjectId>;
