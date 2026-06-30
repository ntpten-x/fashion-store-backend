import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly supabaseService: SupabaseService
    ) { }

    async signUp(body: { email: string; password: string }) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase.auth.signUp({
            email: body.email,
            password: body.password
        });

        if (error) {
            throw new BadRequestException(error.message);
        }
        return data;
    }

    async signIn(body: { email: string; password: string }) {
        return this.supabaseService.login(body);
    }

    async signOut(token: string) {
        await this.supabaseService.logout(token);
    }
}
