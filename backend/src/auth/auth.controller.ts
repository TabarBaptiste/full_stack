import { Controller, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async register(@Body() registerDto: RegisterDto) {
        const { email, password, firstname, lastname, phone } = registerDto;
        return this.authService.register(email, password, firstname, lastname, phone);
    }

    @Public()
    @Post('login')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async login(@Body() loginDto: LoginDto) {
        const { email, password } = loginDto;
        return this.authService.login(email, password);
    }
}