import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsString, Matches} from "class-validator";
import {matchPhoneNumber} from "../../shared/consts/regexp";

export class UpdatePhoneNumberDto {
    @ApiProperty({
        required: true,
        type: String,
    })
    @Matches(matchPhoneNumber, {
        message: 'phone number should be +XXX-XX-XXX-XX-XX format',
    })
    @IsNotEmpty()
    @IsString()
    phone: string;
}