import { Body, Controller, Post, Get, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Public()
    @Post('signup')
    public async signUp(@Body() body: { email: string; password: string }) {
        const result = await this.authService.signUp(body);
        return {
            message: "User registered successfully",
            data: result
        };
    }

    @Public()
    @Post('login')
    public async login(@Body() body: { email: string; password: string }) {
        const result = await this.authService.signIn(body);
        return {
            message: "Login Successfully",
            data: result
        };
    }

    @Post('logout')
    @UseGuards(SupabaseAuthGuard)
    public async logout(@Req() req: Request) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Token is missing');
        }
        const token = authHeader.split(' ')[1];
        await this.authService.signOut(token);
        return {
            message: "Logout Successfully"
        };
    }

    @Get('profile')
    @UseGuards(SupabaseAuthGuard)
    public async getProfile(@CurrentUser() user: any) {
        return user;
    }
}
