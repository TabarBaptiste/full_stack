import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService, JwtPayload } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'monsecretultrasecurise', // À mettre dans .env
        });
    }

    async validate(payload: JwtPayload) {
        try {
            return await this.authService.validateUser(payload);
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}