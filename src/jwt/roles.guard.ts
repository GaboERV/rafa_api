import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from './auth.guard';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler()); // Obtener roles del decorador
    if (!requiredRoles) {
      return true; // Si no se definieron roles, permitir acceso
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userRole = request.user?.rol; // Obtener el rol del usuario autenticado

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException('No tienes permiso para acceder a esta ruta');
    }

    return true;
  }
}
