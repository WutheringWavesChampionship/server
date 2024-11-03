import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { CustomEntity } from './base.entity';
import { CreateWeaponType } from '@shared/interface';
import { RarityEnum, STATS_TYPES, WEAPON_TYPES } from '@shared/constants';
import { ImageEntity } from './image.entity';

@Entity('weapons')
export class WeaponEntity extends CustomEntity implements CreateWeaponType {
  @Column({ unique: true })
  name!: string;
  @Column({
    enum: [
      STATS_TYPES.ATTACK,
      STATS_TYPES.CRIT_CHANCE,
      STATS_TYPES.CRIT_DAMAGE,
      STATS_TYPES.ENERGY_REGENERATION,
      STATS_TYPES.DEFENSE,
    ],
    type: 'enum',
  })
  mainStat!: STATS_TYPES;

  @Column({ type: 'decimal' })
  statValue!: number;

  @Column({ type: 'int' })
  baseAttack!: number;

  @OneToOne(() => ImageEntity, (entity) => entity.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({
    name: 'imageId',
  })
  image!: ImageEntity;
  @Column({ nullable: true })
  imageId!: number;

  @Column({
    enum: [
      WEAPON_TYPES.BROAD_BLADE,
      WEAPON_TYPES.GAUNTLETS,
      WEAPON_TYPES.PISTOLS,
      WEAPON_TYPES.RECTIFIER,
      WEAPON_TYPES.SWORD,
    ],
    type: 'enum',
  })
  type!: WEAPON_TYPES;

  @Column({
    enum: [RarityEnum.EPIC, RarityEnum.LEGENDARY, RarityEnum.COMMON],
    type: 'enum',
    default: RarityEnum.EPIC,
  })
  rarity!: RarityEnum;
}
