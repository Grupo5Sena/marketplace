import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';
import { JWT_EXPIRATION, JWT_SECRET, REFRESH_TOKEN_EXPIRATION, REFRESH_TOKEN_SECRET } from './constants';
import { UserResponseDto } from './dto/user-response.dto';


@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly prisma: PrismaService) {}

    // Registrar nuevo usuario
    async register(dto: RegisterDto): Promise<UserResponseDto> {
        const hashedPassword = await bcrypt.hash(dto.password, 10)

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
                role: dto.role,
                status: 'ACTIVE', 
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                createdAt: true,
            },
        });        
        return user;
    }

    // Login y generación de tokens
    async login(dto: LoginDto): Promise<TokensDto> {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

        if (!user) {throw new UnauthorizedException('Credenciales inválidas')};

        if (!user.password) {throw new UnauthorizedException('Cuenta no válida: contraseña no establecida')}

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) { throw new UnauthorizedException('Credenciales inválidas') }

        if (user.status !== 'ACTIVE') { throw new UnauthorizedException('Usuario inactivo o suspendido') }

        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    // Generar tokens JWT
    async generateTokens(userId: string, email: string, role: string): Promise<TokensDto> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email, role }, { secret: JWT_SECRET, expiresIn: JWT_EXPIRATION }),
            this.jwtService.signAsync( { sub: userId, email, role }, { secret: REFRESH_TOKEN_SECRET, expiresIn: REFRESH_TOKEN_EXPIRATION }),
        ]);

        return { accessToken, refreshToken }
    }

    // Guardar refresh token en DB (para poder revocar)
    async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
             sessions: {
               create: {
                refreshToken: hashedRefreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
              },
            },
          },
       });
    }

    // Refrescar token
    async refreshTokens(userId: string, refreshToken: string): Promise<TokensDto> {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { sessions: true } });

        if (!user) throw new UnauthorizedException('Acceso denegado');

        const session = user.sessions.find((s) => 
          s.refreshToken && bcrypt.compareSync(refreshToken, s.refreshToken),  
        );

        if (!session) throw new UnauthorizedException('Refresh token inválido');

        if (new Date() > session.expiresAt) {
            await this.prisma.authSession.delete({ where: { id: session.id } });
            throw new UnauthorizedException('Refresh token expirado');
        }

        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        // Eliminar el refresh token anterior
        await this.prisma.authSession.delete({ where: { id: session.id } });

        return tokens;
    }

    // Logout: invalidar refresh token
    async logout(userId: string): Promise<void> {
        await this.prisma.authSession.deleteMany({ where: { userId } });
    } 
}