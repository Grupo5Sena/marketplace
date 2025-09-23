import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'usuario@correo.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: '123456' })
  password: string;
}