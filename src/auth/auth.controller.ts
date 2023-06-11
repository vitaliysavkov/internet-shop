import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterRO } from './interfaces/register-ro.interface';
import { LoginRO } from './interfaces/login-ro.interface';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../shared/decorators/public.decorator';

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  async register(@Body() createCustomerDto: RegisterDto): Promise<RegisterRO> {
    return this.authService.register(createCustomerDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() loginCustomerDto: LoginDto, @Req() req: Request): Promise<LoginRO> {
    const origin = req.headers['origin'];
    return this.authService.login(loginCustomerDto, origin);
  }
}
