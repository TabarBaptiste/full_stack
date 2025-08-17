import { PartialType } from '@nestjs/mapped-types';
import { CreateRecurringSlotDto } from './create-recurring-slot.dto';

export class UpdateRecurringSlotDto extends PartialType(CreateRecurringSlotDto) {}
