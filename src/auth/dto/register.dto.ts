import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MinLength
} from 'class-validator';
import {
    containCapitalChar,
    containSpecialChar,
    doNotContainSpace, matchPhoneNumber
} from '../../shared/consts/regexp';

export class RegisterDto {
    @ApiProperty({
        type: String,
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

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
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    name?: string;

    @Matches(matchPhoneNumber, {
        message: 'phone number should be +XXX-XX-XXX-XX-XX format',
    })
    @IsString()
    @IsOptional()
    phone?: string;
}
