import { IsString, IsOptional, IsNumber, IsInt, Min, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePrestationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    @Min(1, { message: 'La durée doit être d\'au moins 1 minute' })
    duration?: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0, { message: 'Le prix doit être positif' })
    @Transform(({ value }) => parseFloat(value))
    price: number;

    @IsOptional()
    @IsInt()
    @Min(1, { message: 'L\id de la catégorie doit être d\'au moins 1' })
    @Transform(({ value }) => value ? parseInt(value) : 1)
    categoryId?: number = 1;
}