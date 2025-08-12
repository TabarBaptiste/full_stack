import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    firstname: string;

    @IsString()
    lastname: string;

    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @IsString()
    phone: string;
}
