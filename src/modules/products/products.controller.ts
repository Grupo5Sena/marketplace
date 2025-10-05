import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'generated/prisma';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @ApiOperation({ summary: 'Listar todos los productos activos' })
    @ApiResponse({ status: 200, description: 'Productos listados correctamente' })
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un producto po ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'ID del producto' })
    @ApiResponse({ status: 200, description: 'Producto encontrado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Get('store/:storeId')
    @ApiOperation({ summary: 'Listar productos de una tienda específica' })
    @ApiParam({ name: 'storeId', type: 'string', description: 'ID de la tienda' })
    findByStore(@Param('storeId') storeId: string) {
        return this.productsService.findByStore(storeId);
    }

    @Post(':storeId')
    @Roles(UserRole.SELLER)
    @ApiOperation({ summary: 'Crear producto en tu tienda (solo SELLER)' })
    @ApiParam({ name: 'storeId', type: 'string' })
    @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
    create(
        @Param('storeId') storeId: string,
        @Req() req,
        @Body() dto: CreateProductDto,
    ) {
        return this.productsService.create(storeId, req.user.userId, dto)
    }

    @Patch(':id')
    @Roles(UserRole.SELLER)
    @ApiOperation({ summary: 'Actualizar producto (solo dueño de la tienda)'})
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'Producto actualizado' })
    update(@Param('id') id: string, @Req() req, @Body() dto: UpdateProductDto) {
        return this.productsService.update(id, req.user.userId, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SELLER)
    @ApiOperation({ summary: 'Eliminar producto (solo dueño de la tienda)' })
    @ApiParam({ name: 'id', type: 'string' })
    @ApiResponse({ status: 200, description: 'Producto eliminado' })
    remove(@Param('id') id: string, @Req() req) {
        return this.productsService.remove(id, req.user.userId);
    }
}
