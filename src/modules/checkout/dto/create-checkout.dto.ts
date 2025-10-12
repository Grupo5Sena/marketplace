import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCheckoutDto {
  @ApiProperty({ example: { street: 'Calle 123', city: 'Bogotá' } })
  @IsNotEmpty()
  shippingAddress: Record<string, any>;

  @ApiProperty({
    example: { street: 'Calle 123', city: 'Bogotá' },
    required: false,
  })
  @IsOptional()
  billingAddress?: Record<string, any>;
}