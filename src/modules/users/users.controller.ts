import { Body, Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Listar todos los usuarios (solo ADMIN)' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios retornada' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Obtener un usuario por ID (solo ADMIN)' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id)
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar un usuario (ADMIN)' })
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }

    @Patch(':Id/role')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Cambiar rol de un usuario (solo ADMIN' })
    changeRole(@Param('id') id: string, @Body() dto: ChangeRoleDto) {
        return this.usersService.changeRole(id, dto)
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Eliminar un usuario (solo ADMIN' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id)
    }

    // Endpoint Práctico para que cada usuario vea/edite su propio perfil
    @Get('me/profile')
    @Roles(UserRole.ADMIN, UserRole.SELLER, UserRole.USER)
    @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
    profile(@Req() req) {
        return this.usersService.findOne(req.user.userId);
    }

    @Patch('me/profile')
    @Roles(UserRole.ADMIN, UserRole.SELLER, UserRole.USER)
    @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
    @ApiBody({ type: UpdateUserDto })
    updateProfile(@Req() req, @Body() dto: UpdateUserDto) {
        return this.usersService.update(req.user.userId, dto);
    }
}
