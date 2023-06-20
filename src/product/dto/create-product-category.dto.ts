import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProductCategoryEnum } from '../enums/product-category.enum';

export class CreateProductCategoryDto {
  @ApiProperty({
    type: String,
    enum: ProductCategoryEnum,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(ProductCategoryEnum)
  name: ProductCategoryEnum;
}
