import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    @ApiOperation({ summary: 'Obtener carrito del usuario autenticado' })
    @ApiResponse({ status: 200, description: 'Carrito obtenido correctamente' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    getCart(@Req() req) {
        return this.cartService.getCart(req.user.userId);
    }

    @Post()
    @ApiOperation({ summary: 'Agregar producto al carrito' })
    @ApiResponse({ status: 201, description: 'Producto agregado al carrito' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    addToCart(@Req() req, @Body() dto: AddToCartDto) {
        return this.cartService.addToCart(req.user.userId, dto);
    }

    @Patch(':itemId')
    @ApiOperation({ summary: 'Actualizar cantidad de un item del carrito' })
    @ApiParam({ name: 'itemId', type: 'string', description: 'ID del item a actualizar' })
    @ApiResponse({ status: 200, description: 'Cantidad actualizada' })
    @ApiResponse({ status: 403, description: 'Item no pertenece al usuario' })
    @ApiResponse({ status: 404, description: 'Item no encontrado' })
    updateItem(
        @Req() req,
        @Param('itemId') itemId: string,
        @Body() dto: UpdateCartItemDto,
    ) {
        return this.cartService.updateItem(req.user.userId, itemId, dto);
    }

    @Delete(':itemId')
    @ApiOperation({ summary: 'Eliminar item del carrito' })
    removeItem(@Req() req, @Param('itemId') itemId: string) {
        return this.cartService.removeItem(req.user.userId, itemId);
    }

    @Delete()
    @ApiOperation({ summary: 'Vaciar carrito' })
    clearCart(@Req() req) {
        return this.cartService.clearCart(req.user.userId);
    }
}
