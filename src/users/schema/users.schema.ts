import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AccountStatus } from 'src/auth/common/enums/account-status.enum';
import { SignupMethod } from './enums/signup-method.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop()
  fullName: string;

  @Prop()
  avatar: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ required: false, default: null })
  googleId: string | null;

  @Prop({
    type: String,
    enum: SignupMethod,
    default: SignupMethod.EMAIL,
  })
  signupMethod: SignupMethod;

  @Prop({
    required: false,
    default: null,
  })
  password: string | null;

  @Prop({
    required: false,
    default: null,
  })
  verificationCode: string | null;

  @Prop({ required: false, default: null })
  verificationCodeExpiry: Date | null;

  @Prop({
    type: String,
    enum: AccountStatus,
    default: AccountStatus.PENDING,
  })
  status: AccountStatus;

  @Prop({ required: false, default: null })
  refreshToken: string | null;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({
    required: false,
    default: null,
  })
  deletedAt: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
