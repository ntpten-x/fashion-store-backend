import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;
    private supabaseUrl: string;
    private supabaseKey: string;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.supabaseUrl = this.configService.get<string>('SUPABASE_URL')!;
        this.supabaseKey = this.configService.get<string>('SUPABASE_KEY')!;

        this.supabase = createClient(this.supabaseUrl, this.supabaseKey)
    }

    getClient(): SupabaseClient {
        return this.supabase;
    }

    async login(body: { email: string, password: string }) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email: body.email, password: body.password
        })

        if (error) {
            throw new UnauthorizedException(error.message)
        }
        return data
    }

    async logout(token: string) {
        // Create temporary client using user's token to securely log out GoTrue session
        const tempClient = createClient(this.supabaseUrl, this.supabaseKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            }
        });

        await tempClient.auth.setSession({ access_token: token, refresh_token: '' });
        const { error } = await tempClient.auth.signOut();

        if (error) {
            throw new UnauthorizedException(error.message);
        }
    }
}
