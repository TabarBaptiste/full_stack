import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateRecurringSlotDto } from './dto/create-recurring-slot.dto';
import { UpdateRecurringSlotDto } from './dto/update-recurring-slot.dto';

@Injectable()
export class RecurringSlotService {
  constructor(private prisma: DatabaseService) { }

  create(data: CreateRecurringSlotDto) {
    return this.prisma.recurringSlot.create({ data });
  }

  findAll() {
    return this.prisma.recurringSlot.findMany();
  }

  findOne(id: number) {
    return this.prisma.recurringSlot.findUnique({ where: { id } });
  }

  update(id: number, data: UpdateRecurringSlotDto) {
    return this.prisma.recurringSlot.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.recurringSlot.delete({ where: { id } });
  }
}
