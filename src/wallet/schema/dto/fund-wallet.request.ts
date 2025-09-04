import { IsNotEmpty, IsNumber } from 'class-validator';

export class FundWalletDto {
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;
}
