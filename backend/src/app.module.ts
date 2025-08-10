import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PrestationModule } from './prestation/prestation.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [DatabaseModule, PrestationModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
