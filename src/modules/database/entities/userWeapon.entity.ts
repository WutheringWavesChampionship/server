import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { WeaponEntity } from './weapon.entity';
import { CreateUserWeaponType } from '@shared/interface';
import { CustomEntity } from './base.entity';

@Entity('user_weapons')
export class UserWeaponEntity
  extends CustomEntity
  implements CreateUserWeaponType
{
  @ManyToOne(() => UserEntity, (entity) => entity.id)
  @JoinColumn({
    name: 'userId',
  })
  user!: UserEntity;
  @Column()
  userId!: number;

  @ManyToOne(() => WeaponEntity, (entity) => entity.id)
  @JoinColumn({
    name: 'weaponId',
  })
  weapon!: WeaponEntity;
  @Column()
  weaponId!: number;

  @Column({ default: 0, type: 'smallint' })
  constants!: number;

  @Column({ default: 1, type: 'smallint' })
  level!: number;
}
