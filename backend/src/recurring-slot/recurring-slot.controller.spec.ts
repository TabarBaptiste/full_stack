import { Test, TestingModule } from '@nestjs/testing';
import { RecurringSlotController } from './recurring-slot.controller';
import { RecurringSlotService } from './recurring-slot.service';

describe('RecurringSlotController', () => {
  let controller: RecurringSlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecurringSlotController],
      providers: [RecurringSlotService],
    }).compile();

    controller = module.get<RecurringSlotController>(RecurringSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
