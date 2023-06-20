import { Controller, Body, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { CustomerService } from './customer.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordRO } from './interfaces/change-password-ro.interface';
import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';
import { UpdatePhoneNumberRO } from './interfaces/update-phone-number-ro.interface';

@ApiTags('Customers Controller')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Patch(':id')
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ChangePasswordRO> {
    const customerId = req.customer.id;
    return this.customerService.changePassword(customerId, changePasswordDto);
  }

  @Patch(':id')
  async updatePhoneNumber(
    @Req() req: Request,
    @Body() updatePhoneNumberDto: UpdatePhoneNumberDto,
  ): Promise<UpdatePhoneNumberRO> {
    const customerId = req.customer.id;
    return this.customerService.updatePhoneNumber(
      customerId,
      updatePhoneNumberDto,
    );
  }
}
