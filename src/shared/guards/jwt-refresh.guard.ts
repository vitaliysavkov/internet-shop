import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CustomerService } from '../../customer/customer.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly customerService: CustomerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const origin = request.headers['origin'];
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Auth token is not provided');
    }

    if (!origin) {
      throw new BadRequestException('origin header is not provided!');
    }

    try {
      const { payload } = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
        complete: true,
        ignoreExpiration: true,
      });

      if (payload?.aud !== origin) {
        return false;
      }

      request.customer = await this.customerService.findById(payload.sub);

      return true;
    } catch (e) {
      return Promise.resolve(false);
    }
  }
}
