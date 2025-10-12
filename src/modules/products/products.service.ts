import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchService } from '../search/search.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService, private SearchService: SearchService) {}

    async create(storeId: string, ownerId: string, dto: CreateProductDto) {
        const store = await this.prisma.store.findUnique({ where: { id: storeId } });
        if(!store) throw new NotFoundException('Tienda No encontrada');
        if (store.ownerId !== ownerId) {
            throw new ForbiddenException('No puedes agregar productos a esta tienda');
        }

        const product = await this.prisma.product.create({ data: { ...dto, storeId } });
        await this.SearchService.indexProduct(product);
        return product;
    }

    async findAll() {
        return this.prisma.product.findMany({
            where: { status: 'ACTIVE' },
            include: { store: true, category: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findByStore(storeId: string) {
        return this.prisma.product.findMany({
            where: { storeId, status: 'ACTIVE' },
            include: { category: true },
        });
    }

    async findOne(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id},
            include: { store: true, category: true }
        });
        if (!product) throw new NotFoundException('Producto no encontrado');
        return product;
    }

    async update(id: string, ownerId: string, dto: UpdateProductDto) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { store: true },
        });
        if (!product) throw new NotFoundException('Producto no encontrado');
        if (product.store.ownerId !== ownerId) {
            throw new ForbiddenException('No puedes modificar este producto');
        }

        const update = this.prisma.product.update({ where: { id }, data: { ...dto } });
        await this.SearchService.updateProduct(update);
        return update; 
    }

    async remove(id: string, ownerId: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { store: true },
        });
        if (!product) throw new NotFoundException('Producto no encontrado');
        if (product.store.ownerId !== ownerId) {
            throw new ForbiddenException('No puedes eliminar este producto');
        }

        await this.prisma.product.delete({ where: { id }});
        await this.SearchService.removeProduct(id); 
    }
}
