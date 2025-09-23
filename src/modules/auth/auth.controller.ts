import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';
import { JwtAuthGuard } from 'src/shared/guards/auth/auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ApiTags, ApiResponse, ApiBody, ApiOperation, ApiProperty } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: RegisterDto })
    @ApiOperation({ summary: 'Registrar un nuevo usuario con email, nombre y contraseña' })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado exitosamente.',
        schema: {
            example: {
               message: 'Usuario registrado exitosamente',
               user: {
                    id: 1,
                    email: 'ejemplo@correo.com',
                    name: 'Nombre Apellido',
                    role: 'user',
               },
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos o usuario ya existe' })
    async register(@Body() dto: RegisterDto): Promise<any> {
        const user = await this.authService.register(dto);
        // Opcional: enviar email de bienvenida aqui
        return {
            message: 'Usuario registrado exitosamente',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginDto })
    @ApiOperation({ summary: 'Iniciar sesión con email y contraseña' })
    @ApiResponse({
        status: 200,
        description: 'Inicio de sesión exitoso',
        schema: {
          example: {
            accessToken: 'jwt_access_token',
            refreshToken: 'jwt_refresh_token',
            user: {
                id: 1,
                email: 'usuario@correo.com',
                name: 'Juan Pérez',
                role: 'user',
             },
          },
        },
    })
    @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
    async login(@Body() dto: LoginDto): Promise<TokensDto> {
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refrescar tokens de acceso' })
    @ApiBody({ schema: { example: { refreshToken: 'jwt_refresh_token' } } })
    @ApiResponse({
        status: 200,
        description: 'Tokens actualizados',
        schema: {
            example: {
            accessToken: 'nuevo_access_token',
            refreshToken: 'nuevo_refresh_token',
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
    async refresh(@Request() req): Promise<TokensDto> {
        const userId = req.user.userId;
        const refreshToken = req.headers.authorization?.replace('Bearer', '');
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Cerrar sesión y revocar el token de refresco' })
    @ApiResponse({
        status: 200,
        description: 'Sesión cerrada exitosamente',
        schema: {
          example: {
            message: 'Sesión cerrada correctamente',
          },
       },
    })
    @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
    async logout(@CurrentUser() user): Promise<{ message: string }> {
        await this.authService.logout(user.userId);
        return { message: 'Sesión cerrada correctamente' };
    }
}
