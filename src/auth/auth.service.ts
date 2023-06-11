import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CustomerService } from '../customer/customer.service';
import { TypeORMError } from 'typeorm';
import { match } from '../utils/crypt.utils';
import { LoginRO } from './interfaces/login-ro.interface';
import { CustomerEntity } from '../customer/entities/customer.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService} from '@nestjs/jwt';
import { RegisterRO } from './interfaces/register-ro.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly customerService: CustomerService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {
    }
    async register(dto: RegisterDto): Promise<RegisterRO> {
        try {
            const customer  = await this.customerService.create(dto);
            console.log(customer);

            return {
                success: true,
                message: 'Customer registered.',
            };
        } catch (error) {
            if (error instanceof TypeORMError) {
                throw new InternalServerErrorException('Failed to register customer.');
            }

            throw error;
        }
    }

    async login(dto: LoginDto, domain) {
        const { email, password } = dto;
        const customer = await this.customerService.findUserByEmail(email);

        if (!customer || !match(customer?.password, password)) {
            throw new BadRequestException('Invalid email or password.');
        }

        return await this.generateTokens(customer, domain);
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
                    expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN')
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
