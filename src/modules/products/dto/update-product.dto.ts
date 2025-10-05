import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Nueva camiseta' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'nueva-camiseta' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Descripción actualizada' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 20000 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({ example: ['moda', 'casual'] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ example: 'uuid-categoria' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'https://cdn.com/img.png' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}