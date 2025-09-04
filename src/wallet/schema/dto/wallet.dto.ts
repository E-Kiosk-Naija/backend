import { ApiProperty } from '@nestjs/swagger';
import { Wallet } from '../wallet.schema';
import { WalletStatus } from '../enums/wallet-status.enum';

export class WalletDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '60c72b2f9b1d8c001c8e4f3a',
  })
  id: string;

  @ApiProperty({
    description: 'Current balance of the wallet',
    example: 100.0,
  })
  balance: number;

  @ApiProperty({
    description: 'Balance of the wallet before the transaction',
    example: 100.0,
  })
  balanceBefore: number;

  @ApiProperty({
    description: 'Balance of the wallet after the transaction',
    example: 90.0,
  })
  balanceAfter: number;

  @ApiProperty({
    description: 'Unique reference for the wallet',
    example: 'wallet_123456789',
  })
  walletReference: string;

  @ApiProperty({
    description: 'Current status of the wallet',
    example: WalletStatus.ACTIVE,
  })
  status: WalletStatus;

  constructor(partial: Partial<WalletDto>) {
    Object.entries(partial).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key in this) {
        this[key] = value;
      }
    });
  }
}
