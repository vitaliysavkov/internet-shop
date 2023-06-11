import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        required: true,
        type: String,
    })
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({
        required: true,
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
