import { Module } from '@nestjs/common';
import { RecurringSlotService } from './recurring-slot.service';
import { RecurringSlotController } from './recurring-slot.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RecurringSlotController],
  providers: [RecurringSlotService],
})
export class RecurringSlotModule {}
