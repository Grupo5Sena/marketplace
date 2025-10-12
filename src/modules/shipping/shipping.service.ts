import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShippingStatus } from '@prisma/client';

@Injectable()
export class ShippingService {
    constructor(private prisma: PrismaService) {}

    async createShipment(userId: string, dto: CreateShipmentDto) {
        const order = await this.prisma.order.findUnique({
            where: { id: dto.orderId },
        });
        if (!order) throw new NotFoundException('Orden no encontrada');

        // Solo el admin o el vendedor dueño de la tienda pueden crear envíos
        const store = await this.prisma.store.findUnique({
            where: { id: order.storeId },
        });
        if (!store) throw new NotFoundException('Tienda no encontrada');
        if (store.ownerId !== userId) throw new ForbiddenException('No esta autorizado');

        return this.prisma.shipping.create({
            data: {
                orderId: dto.orderId,
                address: dto.address,
                carrier: dto.carrier,
                trackingNumber: dto.trackingNumber,
                status: ShippingStatus.PENDING,
            },
        });    
    }

    async getUserShipments(userId: string) {
        return this.prisma.shipping.findMany({
            where: { order: { userId } },
            include: { order: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getStoreShipments(userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
    });
    if (!store) throw new ForbiddenException('No tienes tienda');
    
    return this.prisma.shipping.findMany({
        where: { order: { storeId: store.id } },
        include: { order: true },
        orderBy: { createdAt: 'desc' },
        });
    }

    async getAllShipments() {
        return this.prisma.shipping.findMany({
        include: { order: true },
        orderBy: { createdAt: 'desc' },
        });
    }

    async updateShippingStatus(shippingId: string, dto: UpdateShippingStatusDto) {
        const shipment = await this.prisma.shipping.findUnique({ where: { id: shippingId } });
        if (!shipment) throw new NotFoundException('Envío no encontrado');

        return this.prisma.shipping.update({
        where: { id: shippingId },
        data: { status: dto.status },
        });
    }
}
