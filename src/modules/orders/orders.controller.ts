import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateShippingStatusDto } from './dto/update-shipping-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    // Comprador → sus órdenes
    @Get('my')
    @Roles(UserRole.USER)
    @ApiOperation({ summary: 'Obtener órdenes del comprador autenticado' })
    @ApiResponse({ status: 200, description: 'Lista de órdenes del usuario' })
    getUserOrders(@Req() req) {
        return this.ordersService.getUserOrders(req.user.userId);
    }

    // Vendedor → órdenes de su tienda
    @Get('store')
    @Roles(UserRole.SELLER)
    @ApiOperation({ summary: 'Obtener órdenes de la tienda del vendedor' })
    @ApiResponse({ status: 200, description: 'Lista de órdenes de la tienda' })
    getStoreOrders(@Req() req) {
        return this.ordersService.getStoreOrders(req.user.userId);
    }

    // Admin → todas las órdenes
    @Get('all')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Obtener todas las órdenes (solo admin)' })
    @ApiResponse({ status: 200, description: 'Lista de todas las órdenes' })
    getAllOrders() {
        return this.ordersService.getAllOrders();
    }

    // Actualizar estados
    @Patch(':orderId/status')
    @Roles(UserRole.ADMIN, UserRole.SELLER)
    @ApiOperation({ summary: 'Actualizar estado de la orden' })
    @ApiParam({ name: 'orderId', type: String, description: 'ID de la orden' })
    @ApiResponse({ status: 200, description: 'Orden actualizada correctamente' })
    updateOrderStatus(@Param('orderId') orderId: string, @Body() dto: UpdateOrderStatusDto) {
        return this.ordersService.updateOrderStatus(orderId, dto);
    }

    @Patch(':orderId/shipping')
    @Roles(UserRole.ADMIN, UserRole.SELLER)
    @ApiOperation({ summary: 'Actualizar estado de envío' })
    @ApiParam({ name: 'orderId', type: String, description: 'ID de la orden' })
    @ApiResponse({ status: 200, description: 'Estado de envío actualizado' })
    updateShippingStatus(@Param('orderId') orderId: string, @Body() dto: UpdateShippingStatusDto) {
        return this.ordersService.updateShippingStatus(orderId, dto);
    }

    @Patch(':orderId/payment')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar estado de pago' })
    @ApiParam({ name: 'orderId', type: String, description: 'ID de la orden' })
    @ApiResponse({ status: 200, description: 'Estado de pago actualizado' })
    updatePaymentStatus(@Param('orderId') orderId: string, @Body() dto: UpdatePaymentStatusDto) {
        return this.ordersService.updatePaymentStatus(orderId, dto);
    }
}
