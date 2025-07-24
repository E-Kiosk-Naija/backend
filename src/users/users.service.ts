import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.schema';
import { FilterQuery, Model } from 'mongoose';
import { UserDto } from './schema/dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async validateEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  async createUser(userData: Partial<User>): Promise<UserDto> {
    const newUser = await new this.userModel(userData).save();
    return this.toDto(newUser);
  }

  async getUser(query: FilterQuery<User>): Promise<User | null> {
    const user = await this.userModel.findOne(query);
    return user ? user.toObject() : null;
  }

  private toDto(user: UserDocument): UserDto {
    const plain = user.toObject();
    return new UserDto({
      id: user._id.toString(),
      email: plain.email,
      fullName: plain.fullName,
      avatar: plain.avatar,
      googleId: plain.googleId,
      signupMethod: plain.signupMethod,
      status: plain.status,
      lastLogin: plain.lastLogin,
    });
  }
}
