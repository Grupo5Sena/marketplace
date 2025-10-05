import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private jwt: JwtService) {}

    private async generateTokens(user: any) {
        const playload = { sub: user.id, email: user.email, role: user.role};

        const accessToken = await this.jwt.signAsync(playload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '15m',
        });

        const refreshToken = await this.jwt.signAsync(playload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });

        //Guardar sesión
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.prisma.authSession.create({
            data: {
                userId: user.id,
                refreshToken: hashedRefreshToken, 
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        return { accessToken, refreshToken };
    }

    // Registrar usuario
    async register(dto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: { email: dto.email, password: hashedPassword, name: dto.name },
        });
        return this.generateTokens(user)
    }

    // Login
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Credenciales inválidas');

        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid) throw new UnauthorizedException('Credenciales inválidas');

        return this.generateTokens(user);
    }

    async refreshToken(dto: RefreshTokenDto) {
        const session = await this.prisma.authSession.findFirst({
            where: { refreshToken: dto.refreshToken },
        });
        if ( !session) throw new UnauthorizedException('Refresh token inválido');

        const user = await this.prisma.user.findUnique({ where: { id: session.userId } });
        return this.generateTokens(user);
    }

    async logout(userId: string) {
        await this.prisma.authSession.deleteMany({ where: { userId} });
        return { message: 'Sesión cerrada correctamente'};
    }
}
