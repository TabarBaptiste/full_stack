import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { ReservationModule } from './reservation/reservation.module';
import { PurchaseModule } from './purchase/purchase.module';
import { ReviewModule } from './review/review.module';
import { PrestationsModule } from './prestations/prestations.module';

@Module({
  imports: [DatabaseModule, CategoryModule, ProductModule, UserModule, ReservationModule, PurchaseModule, ReviewModule, PrestationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
