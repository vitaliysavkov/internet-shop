import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiModelProperty({
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
