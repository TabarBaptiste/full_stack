import { PartialType } from '@nestjs/mapped-types';
import { CreatePrestationDto } from './create-prestation.dto';
import { IsOptional } from 'class-validator';

export class UpdatePrestationDto extends PartialType(CreatePrestationDto) {
    @IsOptional()
    title?: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    duration?: number;

    @IsOptional()
    price?: number;

    @IsOptional()
    categoryId?: number;
}