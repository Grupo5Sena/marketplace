import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';

@ApiTags('Checkout')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('checkout')
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) {}

    @Post()
    @ApiOperation({ summary: 'Crear orden desde carrito' })
    @ApiResponse({ status: 201, description: 'Orden creada correctamente' })
    @ApiResponse({ status: 400, description: 'El carrito está vacío o hay un error de validación' })
    createOrder(@Req() req, @Body() dto: CreateCheckoutDto) {
        return this.checkoutService.createOrder(req.user.userId, dto);
    }
}
