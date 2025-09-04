import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WalletStatus } from './enums/wallet-status.enum';

@Schema({ timestamps: true, versionKey: false })
export class Wallet {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, required: true, default: 0 })
  balance: number;

  // @Prop({ type: Number, required: false, default: 0 })
  // balanceBefore: number;

  // @Prop({ type: Number, required: false, default: 0 })
  // balanceAfter: number;

  @Prop({ type: String, required: true, unique: true })
  walletReference: string;

  @Prop({ type: Number, default: 0, required: false })
  ledgerBalance: number;

  @Prop({
    type: String,
    enum: WalletStatus,
    default: WalletStatus.ACTIVE,
  })
  status: WalletStatus;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
export type WalletDocument = Wallet & Document<Types.ObjectId>;
