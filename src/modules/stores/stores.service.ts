import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class StoresService {
    constructor(private prisma: PrismaService) {}

    async create(ownerId: string, dto: CreateStoreDto) {
        // Validar si ya tiene una tienda
        const existing = await this.prisma.store.findUnique({ where: { ownerId } });
        
        if (existing) {
            throw new ForbiddenException('Ya tienes una tienda registrada');
        }

        return this.prisma.store.create({
            data: {
                ...dto,
                ownerId,
            },
        });
    }

    async findAll() {
        return this.prisma.store.findMany({
            where: { isActive: true },
            include: { owner: { select: { id: true, email: true, name: true } } }
        });
    }

    async findOne(id: string) {
        const store = await this.prisma.store.findUnique({
            where: { id },
            include: { owner: { select: { id: true, email: true } } }
        });
        if (!store) throw new NotFoundException('Tienda no encontrada');
        return store;
    }

    async update(storeId: string, ownerId: string, dto: UpdateStoreDto) {
        const store = await this.prisma.store.findUnique({ where: { id: storeId } });
        if (!store) throw new NotFoundException('Tienda no encontrada');
        if (store.ownerId !== ownerId) {
            throw new ForbiddenException('No puedes modificar esta tienda');
        }
        return this.prisma.store.update({
            where: { id: storeId },
            data: dto,
        });
    }

    async remove(storeId: string, ownerId: string,  role: UserRole) {
        const store = await this.prisma.store.findUnique({ where: { id: storeId } });
        if (!store) throw new NotFoundException('Tienda no encontrada');
        if (store.ownerId !== ownerId && role !== UserRole.ADMIN) {
            throw new ForbiddenException('No puedes eliminar esta tienda');
        }

        return this.prisma.store.delete({ where: { id: storeId } });
    }
}
