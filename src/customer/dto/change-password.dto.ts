import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import {
  containCapitalChar,
  containSpecialChar,
  doNotContainSpace,
} from '../../shared/consts/regexp';

export class ChangePasswordDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Matches(containCapitalChar, {
    message: 'password should contain capital character',
  })
  @Matches(containSpecialChar, {
    message: 'password should contain special character',
  })
  @Matches(doNotContainSpace, {
    message: 'password should not contain spaces',
  })
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  confirmNewPassword: string;
}
