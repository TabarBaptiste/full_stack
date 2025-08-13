import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
    @IsEmail({}, { message: 'Veuillez mettre un email valide' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'Le mot de passe doit faire minimum 6 caractères' })
    password: string;

    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEnum(Role)
    role: Role = Role.CLIENT;
}