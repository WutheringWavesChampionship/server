import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { CustomEntity } from './base.entity';
import { UserEntity } from './user.entity';

@Entity('admins')
export class AdminEntity extends CustomEntity {
  @OneToOne(() => UserEntity, (entity) => entity.id)
  @JoinColumn({
    name: 'userId',
  })
  user!: UserEntity;
  @Column()
  userId!: number;
}
