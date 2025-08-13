import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export interface JwtPayload {
    sub: number;
    email: string;
    role: Role;
    firstname: string;
    lastname: string;
}

export interface LoginResponse {
    access_token: string;
    user: {
        id: number;
        email: string;
        firstname: string;
        lastname: string;
        role: Role;
        phone: string;
    };
}

@Injectable()
export class AuthService {
    constructor(
        private readonly database: DatabaseService,
        private readonly jwtService: JwtService,
    ) { }

    async register(email: string, password: string, firstname: string, lastname: string, phone?: string): Promise<LoginResponse> {
        // Vérifier si l'email existe déjà
        const existingUser = await this.database.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('L\'email existe déjà');
        }

        // Hacher le mot de passe
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Créer l'utilisateur
        const user = await this.database.user.create({
            data: {
                email,
                password: hashedPassword,
                firstname,
                lastname,
                phone: phone || '',
                role: Role.CLIENT, // Par défaut CLIENT
            },
        });

        // Générer le token JWT
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                phone: user.phone,
            },
        };
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        // Trouver l'utilisateur
        const user = await this.database.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Générer le token JWT
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                phone: user.phone,
            },
        };
    }

    async validateUser(payload: JwtPayload) {
        const user = await this.database.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                role: true,
                phone: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }
}