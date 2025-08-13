import { IsEmail, IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
    @IsOptional()
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    firstname?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    lastname?: string;

    @IsOptional()
    @IsString()
    phone?: string;
}

// DTO séparé pour l'admin qui peut modifier le rôle
export class UpdateUserRoleDto extends UpdateUserDto {
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}