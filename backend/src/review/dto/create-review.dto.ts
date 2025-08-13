import { IsInt, IsOptional, IsString, IsBoolean, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
    @IsInt()
    @Min(1, { message: 'Rating must be at least 1' })
    @Max(5, { message: 'Rating must not exceed 5' })
    rating: number;

    @IsString()
    content: string;

    @IsBoolean()
    visible: boolean;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    userId: number;
}