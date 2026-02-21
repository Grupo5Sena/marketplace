import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CreateCategoryDto) {
        return this.prisma.category.create({
            data: {
                name: dto.name,
                slug: dto.slug,
                description: dto.description,
                parentId: dto.parentId,
            },
        });
    }

    /*
    opcion de paginacion de categorías
    async findAll(page = 1, limit = 10) {
    return this.prisma.category.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
        include: { children: true },
        });
    }
    */

    async findAll() {
        return this.prisma.category.findMany({
            include: { children: true },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { children: true, parent: true },
        });
        if (!category) throw new NotFoundException('Categoría no encontrada');
        return category;
    }

    async update(id: string, dto: UpdateCategoryDto) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) throw new NotFoundException('Categoría no encontrada');

        return this.prisma.category.update({
            where: { id },
            data: { ...dto },
        })
    }

    async remove(id: string) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) throw new NotFoundException('Categoría no encontrada');

        return this.prisma.category.delete({ where: { id } });
    }
}
