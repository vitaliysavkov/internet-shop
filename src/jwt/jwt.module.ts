import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NestJWT } from './nest-jwt.module';

@Module({
  imports: [NestJWT],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
