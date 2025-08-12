import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsEnum(ReservationStatus)
    status?: ReservationStatus;

    @IsOptional()
    @IsNumber()
    price?: number;

    // On n'autorise généralement pas la modification de userId et prestationId
    // dans une mise à jour, mais on peut les garder optionnels si nécessaire
}