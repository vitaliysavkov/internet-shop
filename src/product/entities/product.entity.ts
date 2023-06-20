import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductCategoryEntity } from './product-category.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column({ length: 100, nullable: false })
  name: string;

  @ApiProperty({ type: String })
  @Column({ nullable: false })
  description: string;

  @ApiProperty({ type: String })
  @Column({ nullable: false })
  vendor: string;

  @ApiProperty({ type: Number })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @ApiProperty({ type: Number })
  @Column({ nullable: false })
  quantity: number;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ProductCategoryEntity)
  @JoinColumn()
  category: ProductCategoryEntity;
}
