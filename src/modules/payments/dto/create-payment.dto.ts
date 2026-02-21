import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { IsUUID, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsUUID()
  orderId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'CREDIT_CARD' })
  @IsString()
  method: PaymentMethod;
}