import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { CustomerService } from '../../customer/customer.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly customerService: CustomerService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

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
        ignoreExpiration: false,
      });

      if (payload?.aud !== origin) {
        return false;
      }

      request.customer = await this.customerService.findById(payload.sub);

      return true;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Token has expired. Please re-login or refresh the token.',
        );
      }

      return Promise.resolve(false);
    }
  }
}
