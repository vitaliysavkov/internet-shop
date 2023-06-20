import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CustomerModule,
    DatabaseModule,
    AuthModule,
    JwtModule,
    ProductModule,
  ],
  providers: [JwtAuthGuard],
})
export class AppModule {}
