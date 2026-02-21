import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@ApiTags('Stores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('stores')
export class StoresController {
    constructor(private readonly storesServices: StoresService) {}

    @Get()   
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: ' Listar todas las tiendas activas' })
    @ApiOkResponse({ description: 'Tiendas activas listadas exitosamente' })
    findAll() {
        return this.storesServices.findAll();
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.SELLER, UserRole.USER)
    @ApiOperation({ summary: 'Obtener tienda por ID' })
    @ApiOkResponse({ description: 'Tienda encontrada exitosamente' })
    @ApiNotFoundResponse({ description: 'Tienda no encontrada' })
    findOne(@Param('id') id: string) {
        return this.storesServices.findOne(id);
    }

    @Post()
    @Roles(UserRole.SELLER)
    @ApiOperation({ summary: 'Crear una tienda (solo SELLER, una por usuario)' })
    @ApiBody({ type: CreateStoreDto })
    @ApiOkResponse({ description: 'Tienda creada exitosamente' })
    @ApiForbiddenResponse({ description: 'Ya tienes una tienda registrada' })
    create(@Req() req, @Body() dto: CreateStoreDto) {
        return this.storesServices.create(req.user.userId, dto);
    }

    @Patch(':id')
    @Roles(UserRole.SELLER)
    @ApiOperation({ summary: 'Actualizar tu tienda (solo el dueño de la tienda puede)' })
    @ApiBody({ type: UpdateStoreDto })
    @ApiOkResponse({ description: 'Tienda actualizada exitosamente' })
    @ApiForbiddenResponse({ description: 'No tienes permiso para editar esta tienda' })
    @ApiNotFoundResponse({ description: 'Tienda no encontrada' })
    update(@Param('id') id: string, @Req() req, @Body() dto: UpdateStoreDto) {
        return this.storesServices.update(id, req.user.userId, dto);
    }

    @Delete(':id')
    @Roles(UserRole.SELLER, UserRole.ADMIN)
    @ApiOperation({ summary: 'Eliminar una tienda (solo el dueño y ADMIN pueden)' })
    @ApiOkResponse({ description: 'Tienda eliminada exitosamente' })
    @ApiForbiddenResponse({ description: 'No tienes permiso para eliminar esta tienda' })
    @ApiNotFoundResponse({ description: 'Tienda no encontrada' })
    remove(@Param('id') id: string, @Req() req) {
        return this.storesServices.remove(id, req.user.userId, req.user.role);
    }
}
