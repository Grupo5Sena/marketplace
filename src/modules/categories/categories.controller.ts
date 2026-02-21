import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { UserRole } from 'generated/prisma';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categorías')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @ApiOperation({ summary: 'Listar todas las categorías' })
     @ApiOkResponse({ description: 'Lista de categorías retornada exitosamente' })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener una categoría po ID' })
    @ApiParam({ name: 'id', description: 'ID de la categoría' })
    @ApiOkResponse({ description: 'Categoría encontrada exitosamente' })
    @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Crear una Categoría (solo ADMIN)' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiCreatedResponse({ description: 'Categoría creada exitosamente' })
    @ApiForbiddenResponse({ description: 'Acceso denegado' })
    create(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.create(dto);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar una categoría (solo ADMIN)' })
    @ApiParam({ name: 'id', description: 'ID de la categoría a actualizar' })
    @ApiBody({ type: UpdateCategoryDto })
    @ApiOkResponse({ description: 'Categoría actualizada correctamente' })
    @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
    update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
        return this.categoriesService.update(id, dto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Eliminar categoría (solo ADMIN)' })
    @ApiParam({ name: 'id', description: 'ID de la categoría a eliminar' })
    @ApiOkResponse({ description: 'Categoría eliminada exitosamente' })
    @ApiNotFoundResponse({ description: 'Categoría no encontrada' })
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
