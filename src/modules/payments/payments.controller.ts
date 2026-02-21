import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { UserRole } from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    // Buyer → iniciar pago
    @Post()
    @Roles(UserRole.USER)
    @ApiOperation({ summary: 'Crear un nuevo pago para una orden' })
    @ApiBody({ type: CreatePaymentDto })
    @ApiResponse({ status: 201, description: 'Pago creado exitosamente' })
    @ApiResponse({ status: 404, description: 'Orden no encontrada' })
    @ApiResponse({ status: 403, description: 'El usuario no puede pagar esta orden' })
    createPayment(@Req() req, @Body() dto: CreatePaymentDto) {
        return this.paymentsService.createPayment(req.user.userId, dto)
    }

    // Buyer → ver historial de pagos
    @Get('me')
    @Roles(UserRole.USER)
    @ApiOperation({ summary: 'Obtener pagos del usuario autenticado' })
    @ApiResponse({ status: 200, description: 'Listado de pagos del usuario.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    getUserPayments(@Req() req) {
        return this.paymentsService.getUserPayments(req.user.userId);
    }

    // Admin → ver todos los pagos
    @Get('all')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Obtener todos los pagos (solo admin)' })
    @ApiResponse({ status: 200, description: 'Listado de todos los pagos.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    getAllPayments() {
        return this.paymentsService.getAllPayments();
    }

    // Admin → actualizar estado del pago
    @Patch(':paymentId/status')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar estado de un pago' })
    @ApiResponse({ status: 200, description: 'pago del usuario actualizado.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    updatePaymentStatus(@Param('paymentId') paymentId: string, @Body() dto: UpdatePaymentStatusDto) {
        return this.paymentsService.updatePaymentStatus(paymentId, dto);
    }
}
