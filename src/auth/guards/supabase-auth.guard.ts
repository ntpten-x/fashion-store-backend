import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SupabaseService } from 'src/supabase/supabase.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly supabaseService: SupabaseService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid token');
        }

        const token = authHeader.split(' ')[1];
        try {
            const supabase = this.supabaseService.getClient();
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (error || !user) {
                throw new UnauthorizedException('Invalid token');
            }

            request.user = user;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
