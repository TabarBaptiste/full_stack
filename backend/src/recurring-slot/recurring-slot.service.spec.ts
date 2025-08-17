import { Test, TestingModule } from '@nestjs/testing';
import { RecurringSlotService } from './recurring-slot.service';

describe('RecurringSlotService', () => {
  let service: RecurringSlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecurringSlotService],
    }).compile();

    service = module.get<RecurringSlotService>(RecurringSlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
