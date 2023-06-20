import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterRO } from './interfaces/register-ro.interface';
import { LoginRO } from './interfaces/login-ro.interface';
import { LoginDto } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../shared/decorators/public.decorator';
import { EraseSensitiveDataInterceptor } from './interceptors/erase-sensitive-data-interceptor.service';
import { JwtRefreshGuard } from '../shared/guards/jwt-refresh.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth Controller')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiConflictResponse()
  @Public()
  @UseInterceptors(EraseSensitiveDataInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  async register(
      @Body() createCustomerDto: RegisterDto,
      @Req() req: Request
  ): Promise<RegisterRO> {
    const origin = req.headers['origin'];
    return this.authService.register(createCustomerDto, origin);
  }

  @ApiBadRequestResponse()
  @Public()
  @UseInterceptors(EraseSensitiveDataInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
      @Body() loginCustomerDto: LoginDto,
      @Req() req: Request
  ): Promise<LoginRO> {
    const origin = req.headers['origin'];
    return this.authService.login(loginCustomerDto, origin);
  }

  @ApiBearerAuth()
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @UseInterceptors(EraseSensitiveDataInterceptor)
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(
      @Body() dto: RefreshTokenDto,
      @Req() req: Request,
  ): Promise<LoginRO> {
    const origin = req.headers['origin'];
    return await this.authService.refresh(dto, origin);
  }
}
