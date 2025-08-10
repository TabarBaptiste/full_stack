import { Module } from '@nestjs/common';
import { PrestationService } from './prestation.service';
import { PrestationController } from './prestation.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PrestationController],
  providers: [PrestationService],
})
export class PrestationModule {}
