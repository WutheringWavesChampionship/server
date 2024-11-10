import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { CustomEntity } from './base.entity';
import { CreateCharacterType } from '@shared/interface';
import { ElementEnum, RarityEnum, WeaponTypeEnum } from '@shared/constants';
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
  @ApiProperty({ example: WeaponTypeEnum.SWORD, enum: WeaponTypeEnum })
  weaponType!: WeaponTypeEnum;

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
