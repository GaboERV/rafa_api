import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: any; // Puedes definir mejor el tipo de usuario si lo tienes
  }
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded; // Guardar usuario en la solicitud
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
