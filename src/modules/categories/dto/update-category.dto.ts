import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Electrodomésticos' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'electrodomesticos' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Productos de línea blanca' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'uuid-categoria-padre' })
  @IsOptional()
  @IsString()
  parentId?: string;
}