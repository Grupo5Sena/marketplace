import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsBoolean } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ example: 'Mi Tienda de Ropa' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'mi-tienda-ropa' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Tienda especializada en ropa urbana' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://mistienda.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ example: 'https://cdn.com/logo.png' })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}