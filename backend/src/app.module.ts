import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PrestationModule } from './prestation/prestation.module';

@Module({
  imports: [DatabaseModule, PrestationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
