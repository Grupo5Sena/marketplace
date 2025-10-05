import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Nombre completo del usuario' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'strongPassword123', description: 'Contraseña del usuario' })
  @MinLength(6)
  password: string;  
}