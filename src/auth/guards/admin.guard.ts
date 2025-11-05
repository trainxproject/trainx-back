import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Primero verifica la autenticación JWT
        const isAuthenticated = await super.canActivate(context);
        if (!isAuthenticated) {
        return false;
        }

        // Luego verifica el rol de admin
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
        throw new ForbiddenException('User not found');
        }

        // Verifica si el usuario es admin (usando el campo role o isAdmin)
        const isAdmin = user.role === UserRole.ADMIN || user.isAdmin === true;
        
        if (!isAdmin) {
        throw new ForbiddenException('Access denied. Admin privileges required.');
        }

        return true;
    }
}