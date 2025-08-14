import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CategoryModule } from './category/category.module';
import { ReservationModule } from './reservation/reservation.module';
import { PurchaseModule } from './purchase/purchase.module';
import { ReviewModule } from './review/review.module';
import { PrestationsModule } from './prestations/prestations.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PurchasesModule } from './purchases/purchases.module';

@Module({
  imports: [DatabaseModule, AuthModule, CategoryModule, ReservationModule, PurchaseModule, ReviewModule, PrestationsModule, ProductsModule, UsersModule, PurchasesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
