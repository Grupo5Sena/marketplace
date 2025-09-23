import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client'; // Asegúrate de tener el enum en tu schema
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'ejemplo@correo.com', description: 'Correo electrónico único del usuario' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: '123456', description: 'Contraseña (mínimo 6 caracteres)' })
  password: string;

  @IsString()
  @IsNotEmpty()
   @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  name: string;

  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER; // Por defecto es comprador
}