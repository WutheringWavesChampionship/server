import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

export class CustomEntity extends BaseEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ example: new Date() })
  @CreateDateColumn()
  createdAt: Date;
  @ApiProperty({ example: new Date() })
  @UpdateDateColumn()
  updatedAt: Date;
}
