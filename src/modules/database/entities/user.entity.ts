import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { CustomEntity } from './base.entity';
import { CreateUserType } from '@shared/interface';
import { ImageEntity } from './image.entity';

@Entity('users')
export class UserEntity extends CustomEntity implements CreateUserType {
  @Column({ unique: true })
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
  image!: ImageEntity;
  @Column({ nullable: true })
  imageId?: number;

  @Column()
  auth_date!: Date;

  @Column({ unique: true, nullable: true })
  telegram_id?: string;
}
