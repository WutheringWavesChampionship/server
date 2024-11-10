import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { CustomEntity } from './base.entity';
import { CreateWeaponType } from '@shared/interface';
import { RarityEnum, StatTypeEnum, WeaponTypeEnum } from '@shared/constants';
import { ImageEntity } from './image.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('weapons')
export class WeaponEntity extends CustomEntity implements CreateWeaponType {
  @ApiProperty({ example: 'Variation' })
  @Column({ unique: true })
  name!: string;
  @ApiProperty({
    example: StatTypeEnum.ENERGY_REGENERATION,
    enum: [
      StatTypeEnum.ATTACK,
      StatTypeEnum.CRIT_CHANCE,
      StatTypeEnum.CRIT_DAMAGE,
      StatTypeEnum.ENERGY_REGENERATION,
      StatTypeEnum.DEFENSE,
    ],
  })
  @Column({
    enum: [
      StatTypeEnum.ATTACK,
      StatTypeEnum.CRIT_CHANCE,
      StatTypeEnum.CRIT_DAMAGE,
      StatTypeEnum.ENERGY_REGENERATION,
      StatTypeEnum.DEFENSE,
    ],
    type: 'enum',
  })
  mainStat!: StatTypeEnum;

  @ApiProperty({ example: 50.4 })
  @Column({ type: 'decimal' })
  statValue!: number;

  @ApiProperty({ example: 320 })
  @Column({ type: 'int' })
  baseAttack!: number;

  @OneToOne(() => ImageEntity, (entity) => entity.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({
    name: 'imageId',
  })
  @ApiProperty()
  image?: string;
  @ApiProperty({ example: 1 })
  @Column({ nullable: true })
  imageId?: number;

  @Column({
    enum: [
      WeaponTypeEnum.BROAD_BLADE,
      WeaponTypeEnum.GAUNTLETS,
      WeaponTypeEnum.PISTOLS,
      WeaponTypeEnum.RECTIFIER,
      WeaponTypeEnum.SWORD,
    ],
    type: 'enum',
  })
  @ApiProperty({
    example: WeaponTypeEnum.RECTIFIER,
    enum: [
      WeaponTypeEnum.BROAD_BLADE,
      WeaponTypeEnum.GAUNTLETS,
      WeaponTypeEnum.PISTOLS,
      WeaponTypeEnum.RECTIFIER,
      WeaponTypeEnum.SWORD,
    ],
  })
  type!: WeaponTypeEnum;

  @ApiProperty({
    example: RarityEnum.EPIC,
    enum: [RarityEnum.EPIC, RarityEnum.LEGENDARY, RarityEnum.COMMON],
  })
  @Column({
    enum: [RarityEnum.EPIC, RarityEnum.LEGENDARY, RarityEnum.COMMON],
    type: 'enum',
    default: RarityEnum.EPIC,
  })
  rarity!: RarityEnum;
}
