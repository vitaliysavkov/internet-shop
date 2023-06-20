import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CustomerService } from '../customer/customer.service';
import { TypeORMError } from 'typeorm';
import { encrypt, match } from '../utils/crypt.utils';
import { LoginRO } from './interfaces/login-ro.interface';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService} from '@nestjs/jwt';
import { RegisterRO } from './interfaces/register-ro.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenExpiredError } from 'jsonwebtoken';
import { JWT } from './interfaces/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly customerService: CustomerService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
    }
    async register(dto: RegisterDto, domain: string): Promise<RegisterRO> {
        const { email, password} = dto;
        const customer = await this.customerService.findByEmail(email);
        if (customer) {
            throw new ConflictException();
        }
        try {
            const hashedPassword = encrypt(password);
            const newCustomer= await this.customerService.create({ ...dto, password: hashedPassword });

            return await this.generateTokens(newCustomer, domain);
        } catch (error) {
            if (error instanceof TypeORMError) {
                throw new InternalServerErrorException('Failed to register customer.');
            }

            throw error;
        }
    }

    async login(dto: LoginDto, domain) {
        const { email, password } = dto;
        const customer = await this.customerService.findByEmail(email);

        if (!customer || !match(customer?.password, password)) {
            throw new BadRequestException('Invalid email or password.');
        }

        return await this.generateTokens(customer, domain);
    }

    async refresh(
        { refreshToken }: RefreshTokenDto,
        domain: string,
    ): Promise<LoginRO> {
        try {
            await this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                ignoreExpiration: false,
            });
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new UnauthorizedException(
                    'Your token has expired. Please re-login.',
                );
            }

            throw new BadRequestException('The provided token is invalid.');
        }

        const decoded = (this.jwtService.decode(refreshToken, {
            complete: true,
            json: true,
        })) as JWT;

        const user = await this.customerService.findById(+decoded.payload.sub);

        if (!user) {
            throw new ForbiddenException('Access denied.');
        }

        return await this.generateTokens(user, domain);
    }

    private async generateTokens(
        customer: CustomerEntity,
        domain: string,
    ): Promise<LoginRO> {
        const [accessToken, refreshToken] = [
            this.jwtService.sign(
                {
                    sub: customer.id.toString(),
                    aud: domain,
                },
                {
                    secret: this.configService.get('JWT_SECRET'),
                    expiresIn: +this.configService.get('JWT_ACCESS_EXPIRES_IN')
                },
            ),
            this.jwtService.sign(
                {
                    sub: customer.id.toString(),
                },
                {
                    secret: this.configService.get('JWT_REFRESH_SECRET'),
                    expiresIn: +this.configService.get('JWT_REFRESH_EXPIRES_IN'),
                },
            ),
        ];

        return {
            customer,
            tokens: {
                accessToken: {
                    value: accessToken,
                    expiresIn: +this.configService.get('JWT_ACCESS_EXPIRES_IN'),
                },
                refreshToken: {
                    value: refreshToken,
                    expiresIn: +this.configService.get('JWT_REFRESH_EXPIRES_IN'),
                },
            },
        };
    }
}
