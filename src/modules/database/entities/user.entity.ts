import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { CustomEntity } from './base.entity';
import { UserType } from '@shared/interface';
import { ImageEntity } from './image.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UserEntity extends CustomEntity implements UserType {
  @Column({ unique: true })
  @ApiProperty({ example: 'admin' })
  username!: string;

  @Column({ nullable: true })
  password?: string;

  @OneToOne(() => ImageEntity, (entity) => entity.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({
    name: 'imageId',
  })
  image!: string;
  @ApiProperty({ example: 1 })
  @Column({ nullable: true })
  imageId?: number;

  @Column()
  @ApiProperty({ example: new Date() })
  auth_date!: Date;

  @Column({ unique: true, nullable: true })
  @ApiProperty({ example: 1 })
  telegram_id?: string;
}
