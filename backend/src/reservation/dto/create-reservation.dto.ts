import { IsInt, IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateReservationDto {
    @IsDateString()
    startDate: string;

    @IsDateString()
    endDate: string;

    @IsOptional()
    @IsEnum(ReservationStatus)
    status?: ReservationStatus = ReservationStatus.PENDING;

    @IsNumber()
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    price: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    userId: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    prestationId: number;

    @IsOptional()
    @IsString()
    notes?: string; // Pour des notes spéciales du client
}

export class CreateReservationBySlotDto {
    @IsDateString()
    date: string; // Format: YYYY-MM-DD

    @IsString()
    startTime: string; // Format: HH:mm

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    prestationId: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    userId: number;

    @IsOptional()
    @IsString()
    notes?: string;
}