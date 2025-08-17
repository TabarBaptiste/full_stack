import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { RecurringSlotService } from './recurring-slot.service';
import { CreateRecurringSlotDto } from './dto/create-recurring-slot.dto';
import { UpdateRecurringSlotDto } from './dto/update-recurring-slot.dto';

@Controller('recurring-slots')
export class RecurringSlotController {
  constructor(private readonly recurringSlotService: RecurringSlotService) { }

  @Post()
  create(@Body() dto: CreateRecurringSlotDto) {
    return this.recurringSlotService.create(dto);
  }

  @Get()
  findAll() {
    return this.recurringSlotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recurringSlotService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRecurringSlotDto) {
    return this.recurringSlotService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recurringSlotService.remove(id);
  }
}
