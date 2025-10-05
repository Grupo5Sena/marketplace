import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electrónica' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'electronica' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'Todo tipo de dispositivos electrónicos' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'uuid-categoria-padre' })
  @IsOptional()
  @IsString()
  parentId?: string;
}