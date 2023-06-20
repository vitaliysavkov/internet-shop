import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from './product.entity';
import { ProductCategoryEnum } from '../enums/product-category.enum';

@Entity({ name: 'product_categories' })
export class ProductCategoryEntity {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column({
    unique: true,
    type: 'enum',
    enum: ProductCategoryEnum,
    nullable: false,
  })
  name: string;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
