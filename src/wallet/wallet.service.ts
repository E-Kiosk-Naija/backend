import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Wallet, WalletDocument } from './schema/wallet.schema';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/users/schema/users.schema';
import { UsersService } from 'src/users/users.service';
import { WalletDto } from './schema/dto/wallet.dto';
import { ApiResponse } from 'src/universal/api.response';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    private readonly usersService: UsersService,
  ) {}

  async createWallet(user: UserDocument): Promise<WalletDocument> {
    const wallet = new this.walletModel({
      user: user._id,
      walletReference: this.generateWalletReference(user._id.toString()),
      balance: 0,
    });
    return await wallet.save();
  }

  async createWalletForUser(
    user: UserDocument,
  ): Promise<ApiResponse<WalletDto>> {
    const userExists = await this.usersService.findUser({ email: user.email });

    if (!userExists) {
      throw new BadRequestException('User not found');
    }

    const walletExists = await this.findWallet({
      user: userExists._id,
    });

    if (walletExists) {
      throw new ConflictException('Wallet already exists');
    }

    const savedWallet = await this.createWallet(userExists);
    return ApiResponse.success(
      HttpStatus.CREATED,
      'Wallet created successfully',
      this.toDto(savedWallet),
    );
  }

  async getUserWallet(user: User): Promise<ApiResponse<WalletDto>> {
    const userExists = await this.usersService.findUser({ email: user.email });

    if (!userExists) {
      throw new BadRequestException('User not found');
    }

    const wallet = await this.walletModel.findOne({ user: userExists._id });

    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    return ApiResponse.success(
      HttpStatus.OK,
      'Wallet retrieved successfully',
      this.toDto(wallet),
    );
  }

  async findWallet(
    filter: FilterQuery<Wallet>,
  ): Promise<WalletDocument | null> {
    return await this.walletModel.findOne(filter);
  }

  private toDto(wallet: WalletDocument): WalletDto {
    return new WalletDto({
      id: wallet._id.toString(),
      ...wallet,
    });
  }

  private generateWalletReference(userId: string): string {
    const shortId = userId.toString().slice(-6); // last 6 chars of ObjectId
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `WALLET-${shortId}-${random}`;
  }
}
