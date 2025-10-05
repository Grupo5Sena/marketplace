import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'generated/prisma';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // si no hay roles especificos, permitir
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('Usuario no autenticado');
    
    // Si el role del usuario no está en la lisya permitida -> denegar
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso');
    }

    // Caso especial: si es SELLER, validar que tenga tienda activa
    if (user.role === UserRole.SELLER && requiredRoles.includes(UserRole.SELLER)) {
      const store = await this.prisma.store.findFirst({ where: { ownerId: user.userId, isActive: true } });

      if (!store) {
        throw new ForbiddenException('Necesitas tener una tienda activa para acceder a esta funcionalidad');
      }
    }
    return true;
  }
}
