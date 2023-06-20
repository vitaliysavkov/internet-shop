import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'customers' })
export class CustomerEntity {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String })
  @Column({
    unique: true,
    length: 255,
    nullable: false,
  })
  email: string;

  @ApiProperty({ type: String })
  @Column({
    length: 100,
    nullable: false,
  })
  password: string;

  @ApiProperty({ type: String })
  @Column({
    length: 30,
    nullable: true,
  })
  name: string;

  @ApiProperty({ type: String })
  @Column({
    length: 15,
    nullable: true,
  })
  phone: string;

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updatedAt: Date;
}
