import { IsString, IsOptional, IsNumber, IsInt, Min, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    @Min(0, { message: 'Le stock doit être positif' })
    stock?: number = 0;

    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0, { message: 'Le prix doit être positif' })
    @Transform(({ value }) => parseFloat(value))
    price: number = 0;

    @IsOptional()
    @IsInt()
    @Min(1, { message: 'L\id de la catégorie doit être d\'au moins 1' })
    @Transform(({ value }) => value ? parseInt(value) : 2)
    categoryId?: number = 2;
}