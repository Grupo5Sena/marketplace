import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UserRole } from 'generated/prisma';
import { UpdateShippingStatusDto } from './dto/update-shipping-status.dto';

@ApiTags('Shipping')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('shipping')
export class ShippingController {
    constructor(private readonly shippingService: ShippingService) {}
    
    // Seller → crear envío para una orden
    @Post()
    @Roles(UserRole.SELLER)
    @ApiOperation({ summary: 'Crear envío para una orden' })
    @ApiResponse({ status: 201, description: 'Envío creado exitosamente.' })
    @ApiResponse({ status: 403, description: 'No autorizado para crear el envío.' })
    @ApiResponse({ status: 404, description: 'Orden o tienda no encontrada.' })
    createShipment(@Req() req, @Body() dto: CreateShipmentDto) {
        return this.shippingService.createShipment(req.user.userId, dto);
    }

    // Buyer → consultar sus envíos
    @Get('my')
    @Roles(UserRole.USER)
    @ApiOperation({ summary: 'Obtener envíos del usuario autenticado' })
    @ApiResponse({ status: 201, description: 'Listado de envíos del usuario.' })
    @ApiResponse({ status: 403, description: 'No autorizado.' })
    getUserShipments(@Req() req) {
        return this.shippingService.getUserShipments(req.user.userId);
    }

    // Seller → envíos de su tienda
    @Get('store')
    @Roles(UserRole.SELLER)
    @ApiOperation({ summary: 'Obtener envíos de la tienda del vendedor' })
    @ApiResponse({ status: 201, description: 'Listado de envíos de la tienda.' })
    @ApiResponse({ status: 403, description: 'No autorizado.' })
    getStoreShipments(@Req() req) {
        return this.shippingService.getStoreShipments(req.user.userId);
    }

    // Admin → todos los envíos
    @Get('all')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Obtener todos los envíos (solo admin)' })
    @ApiResponse({ status: 201, description: 'Listado de envíos general.' })
    getAllShipments() {
        return this.shippingService.getAllShipments();
    }

    // Admin o Seller → actualizar estado del envío
    @Patch(':shippingId/status')
    @Roles(UserRole.ADMIN, UserRole.SELLER)
    @ApiOperation({ summary: 'Actualizar estado de un envío' })
    @ApiResponse({ status: 201, description: 'Envío actualizado correctamente.' })
    updateShippingStatus(
        @Param('shippingId') shippingId: string,
        @Body() dto: UpdateShippingStatusDto,
    ) {
        return this.shippingService.updateShippingStatus(shippingId, dto);
    }
}
