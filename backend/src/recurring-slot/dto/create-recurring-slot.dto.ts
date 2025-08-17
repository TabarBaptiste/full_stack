import { IsInt, IsString } from 'class-validator';

export class CreateRecurringSlotDto {
    @IsInt()
    dayOfWeek: number; // 0 = Dimanche, 6 = Samedi

    @IsString()
    startTime: string; // ex: "09:00"

    @IsString()
    endTime: string; // ex: "12:00"
}
