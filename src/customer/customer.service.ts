import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from './entities/customer.entity';
import { RegisterDto } from '../auth/dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async create(dto: RegisterDto): Promise<CustomerEntity> {
    return this.customerRepository.save(dto);
  }
  async findById(id: number): Promise<CustomerEntity> {
    return await this.customerRepository.findOneBy({ id });
  }

  async changePassword(id: number, dto: ChangePasswordDto) {
    //TODO: implement
    return undefined;
  }

  updatePhoneNumber(id: number, dto: UpdatePhoneNumberDto) {
    //TODO: implement
    return undefined;
  }

  async findByEmail(email: string): Promise<CustomerEntity> {
    return await this.customerRepository.findOneBy({ email });
  }
}
