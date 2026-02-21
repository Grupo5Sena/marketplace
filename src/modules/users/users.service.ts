import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ChangeRoleDto } from './dto/change-role.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
        return user;
    }

    async update(id: string, dto: UpdateUserDto) {
        // Evitar cambiar roller por aquí (user changeRole)
        const data: any = { ...dto };
        if (dto.password) {
            data.password = await bcrypt.hash(dto.password, 10)
        }
        try {
            return await this.prisma.user.update({
                where: { id },
                data, 
                select: {
                    id: true,
                    email: true,
                    name: true,
                    avatar: true,
                    phone: true,
                    role: true,
                    status: true,
                },
            });
        } catch (e) {
            throw new BadRequestException('Error al actualizar usuario');
        }
    }

    async changeRole(id: string, dto: ChangeRoleDto) {
        // Si asinas SELLER, puedes crear la tienda en otro flujo
        return this.prisma.user.update({
            where: { id },
            data: { role: dto.role },
            select: { id: true, email: true, role: true },
        });
    }

    async remove(id: string) {
        // Se puede preferir soft-delete (agregar deletedAt), aquí hard delete
        await this.prisma.user.delete({ where: { id } });
        return { ok: true }
    }

    // utilidad: obtener usuario por email (ej: para Auth)
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }
}
