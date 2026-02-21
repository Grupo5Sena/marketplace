import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@Injectable()
export class CheckoutService {
    constructor(private prisma: PrismaService) {}

    async createOrder(userId: string, dto: CreateCheckoutDto) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('El carrtio está vacío');
        }

        let total = 0;
        const orderItems = cart.items.map((item) => {
            const subtotal = item.quantity * item.product.price;
            total += subtotal;
            return {
                productId: item.productId,
                productName: item.product.name,
                productPrice: item.product.price,
                quantity: item.quantity,
                subtotal,
            };
        });

        const order = await this.prisma.order.create({
            data: {
                code: `ORD-${Date.now()}`,
                userId,
                storeId: cart.items[0].product.storeId,
                total,
                shippingAddress: dto.shippingAddress,
                billingAddress: dto.billingAddress ?? dto.shippingAddress,
                items: { create: orderItems },
            },
            include: { items: true },
        });

        // Limpiar carrito
        await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

        return order;        
    }
}
