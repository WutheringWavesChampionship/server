import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { CustomEntity } from './base.entity';
import { CreateCharacterType } from '@shared/interface';
import { ElementEnum, RarityEnum, WEAPON_TYPES } from '@shared/constants';
import { ImageEntity } from './image.entity';

@Entity('characters')
export class CharacterEntity
  extends CustomEntity
  implements CreateCharacterType
{
  @Column({ unique: true })
  name!: string;

  @OneToOne(() => ImageEntity, (entity) => entity.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'imageId',
  })
  image!: ImageEntity;
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
  element!: ElementEnum;

  @Column({
    enum: [RarityEnum.LEGENDARY, RarityEnum.EPIC],
    type: 'enum',
    default: RarityEnum.EPIC,
  })
  rarity!: RarityEnum.LEGENDARY | RarityEnum.EPIC;
}
