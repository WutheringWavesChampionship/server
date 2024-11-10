import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { WeaponEntity } from './weapon.entity';
import { CreateUserWeaponType } from '@shared/interface';
import { CustomEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { MAX_WEAPON_CONSTANTS, MAX_WEAPON_LEVEL } from '@shared/constants';

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
  @ApiProperty({ example: 1 })
  @Column()
  userId!: number;

  @ManyToOne(() => WeaponEntity, (entity) => entity.id)
  @JoinColumn({
    name: 'weaponId',
  })
  @ApiProperty()
  weapon!: WeaponEntity;
  @ApiProperty({ example: 1 })
  @Column()
  weaponId!: number;

  @ApiProperty({ example: MAX_WEAPON_CONSTANTS, maximum: MAX_WEAPON_CONSTANTS })
  @Column({ default: 0, type: 'smallint' })
  constants!: number;

  @ApiProperty({ example: MAX_WEAPON_LEVEL, maximum: MAX_WEAPON_LEVEL })
  @Column({ default: 1, type: 'smallint' })
  level!: number;
}
