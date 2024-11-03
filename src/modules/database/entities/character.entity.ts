import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { CustomEntity } from './base.entity';
import { CreateCharacterType } from '@shared/interface';
import { ElementEnum, RarityEnum, WEAPON_TYPES } from '@shared/constants';
import { ImageEntity } from './image.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('characters')
export class CharacterEntity
  extends CustomEntity
  implements CreateCharacterType
{
  @ApiProperty({ example: 'camelia' })
  @Column({ unique: true })
  name!: string;

  @OneToOne(() => ImageEntity, (entity) => entity.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'imageId',
  })
  image!: ImageEntity;
  @ApiProperty({ example: 1 })
  @Column()
  imageId: number;

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
  @ApiProperty({ example: WEAPON_TYPES.SWORD, enum: WEAPON_TYPES })
  weaponType!: WEAPON_TYPES;

  @Column({
    enum: [
      ElementEnum.AERO,
      ElementEnum.FUSION,
      ElementEnum.GLACIO,
      ElementEnum.HAVOC,
      ElementEnum.SPECTRO,
      ElementEnum.ELECTRO,
    ],
    type: 'enum',
  })
  @ApiProperty({ example: ElementEnum.HAVOC, enum: ElementEnum })
  element!: ElementEnum;

  @Column({
    enum: [RarityEnum.LEGENDARY, RarityEnum.EPIC],
    type: 'enum',
    default: RarityEnum.EPIC,
  })
  @ApiProperty({
    example: RarityEnum.LEGENDARY,
    enum: [RarityEnum.LEGENDARY, RarityEnum.EPIC],
  })
  rarity!: RarityEnum.LEGENDARY | RarityEnum.EPIC;
}
