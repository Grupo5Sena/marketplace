import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsBoolean } from 'class-validator';

export class UpdateStoreDto {
  @ApiPropertyOptional({ example: 'Nuevo nombre de tienda' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'nueva-tienda' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Descripción actualizada' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://nuevatienda.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}