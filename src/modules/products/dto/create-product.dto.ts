import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Camiseta de algodón' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'camiseta-algodon' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Camiseta básica 100% algodón' })
  @IsString()
  description: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 30000 })
  @IsOptional()
  @IsNumber()
  compareAtPrice?: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  stock: number;

  @ApiPropertyOptional({ example: ['ropa', 'algodón'] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty({ example: 'uuid-categoria' })
  @IsString()
  categoryId: string;

  @ApiPropertyOptional({ example: 'https://cdn.com/img.png' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}