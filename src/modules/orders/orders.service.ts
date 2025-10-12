import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateShippingStatusDto } from './dto/update-shipping-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {}

    async getUserOrders(userId: string) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: true, store: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getStoreOrders(userId: string) {
        const store = await this.prisma.store.findUnique({ where: { ownerId: userId } });
        if (!store) throw new ForbiddenException('No tienes una tienda');

        return this.prisma.order.findMany({
            where: { storeId: store.id },
            include: { items: true, user: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getAllOrders() {
        return this.prisma.order.findMany({
            include: { items: true, user: true, store: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) throw new NotFoundException('Orden no encontrada');

        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: dto.status },
        });
    }

    async updateShippingStatus(orderId: string, dto: UpdateShippingStatusDto) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) throw new NotFoundException('Orden no encontrada');

        return this.prisma.order.update({
            where: { id: orderId },
            data: { shippingStatus: dto.shippingStatus },
        });
    }

    async updatePaymentStatus(orderId: string, dto: UpdatePaymentStatusDto) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) throw new NotFoundException('Orden no encontrada');

        return this.prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: dto.paymentStatus },
        });
    }
}
