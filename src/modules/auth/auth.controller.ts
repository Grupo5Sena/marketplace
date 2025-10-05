import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Registro de Usuario'})
     @ApiResponse({ status: 201, description: 'Usuario registrado con éxito y tokens generados' })
    register(@Body() dto: RegisterDto) {
        return this.auth.register(dto);
    }

    @Post('login')
    @ApiOperation({ summary: 'login de usuario' })
    @ApiResponse({ status: 200, description: 'Login exitoso y tokens generados' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    login(@Body() dto: LoginDto) {
        return this.auth.login(dto);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refrescar tokens con refresh token' })
    @ApiResponse({ status: 200, description: 'Tokens refrescados correctamente' })
    refresh(@Body() dto: RefreshTokenDto) {
        return this.auth.refreshToken(dto)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('logout')
    @ApiOperation({ summary: 'Cerrar sesión (logout)' })
    @ApiResponse({ status: 200, description: 'Sesión cerrada correctamente' })
    logout(@Req() req) {
        return this.auth.logout(req.user.userId);
    }
}
