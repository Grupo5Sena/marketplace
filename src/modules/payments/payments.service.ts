import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from 'generated/prisma';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Injectable()
export class PaymentsService {
    constructor(private prisma:PrismaService) {}

    async createPayment(userId: string, dto: CreatePaymentDto) {
        const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
        if (!order) throw new NotFoundException('Orden no encontrada');
        if (order.userId !== userId) throw new ForbiddenException('No puedes pagar esta orden');

        return this.prisma.payment.create({
            data: {
                orderId: dto.orderId,
                amount: dto.amount,
                method: dto.method,
                status: PaymentStatus.PENDING,
                userId,
            },
        });
    }

    async getUserPayments(userId: string) {
        return this.prisma.payment.findMany({
            where: { userId },
            include: { order: true },
            orderBy: { createdAt: 'desc' },
        });
    }    

    async getAllPayments() {
        return this.prisma.payment.findMany({
            include: { order: true, user: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updatePaymentStatus(paymentId: string, dto: UpdatePaymentStatusDto) {
        const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
        if (!payment) throw new NotFoundException('Pago no encontrado');

        return this.prisma.payment.update({
            where: { id: paymentId },
            data: { status: dto.status }
        });
    }
}
