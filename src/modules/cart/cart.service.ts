import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    async getCart(userId: string) {
        return this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });
    }

    async addToCart(userId: string, dto: AddToCartDto) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product) throw new NotFoundException('Producto no encontrado');

        let cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await this.prisma.cart.create({ data: { userId }});
        }

        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: dto.productId,
                },
            },
        });

        if (existingItem) {
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + dto.quantity },
            });
        }

        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: dto.productId,
                quantity: dto.quantity,
            },
        });
    }

    async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart) throw new NotFoundException('Carrito no encontrado');

        const item = await this.prisma.cartItem.findUnique({ where: { id: itemId }});
        if (!item) throw new NotFoundException('Item no encontrado');
        if (item.cartId !== cart.id)
            throw new ForbiddenException('Este item no pertenece a tu carrito');

        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: dto.quantity },
        });
    }

    async removeItem(userId: string, itemId: string) {
        const cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart) throw new NotFoundException('Carrito no encontrado');

        const item  = await this.prisma.cartItem.findUnique({ where: { id: itemId } });
        if (!item) throw new NotFoundException('Item no encontrado');
        if (item.cartId !== cart.id)
            throw new ForbiddenException('Este item no pertence a tu carrito');

        return this.prisma.cartItem.delete({ where: { id: itemId } });
    }

    async clearCart(userId: string) {
        const cart =  await this.prisma.cart.findUnique({ where: { userId }});
        if (!cart) throw new NotFoundException('Carrito no encontrado');

        return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
}
