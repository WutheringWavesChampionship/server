import { ApiProperty } from '@nestjs/swagger';
import {
  ElementEnum,
  MAX_CHARACTER_CONSTANTS,
  MAX_CHARACTER_LEVEL,
  RarityEnum,
  WeaponTypeEnum,
} from '@shared/constants';
import {
  CreateCharacterType,
  CreateUserCharacterType,
  UpdateUserCharacterType,
} from '@shared/interface';

export class CreateCharacterDTO implements CreateCharacterType {
  @ApiProperty({ example: ElementEnum.HAVOC, enum: ElementEnum })
  element: ElementEnum;
  @ApiProperty({ example: 'Camelia' })
  name: string;
  @ApiProperty({
    example: RarityEnum.LEGENDARY,
    enum: [RarityEnum.EPIC, RarityEnum.LEGENDARY],
  })
  rarity: RarityEnum.EPIC | RarityEnum.LEGENDARY;
  @ApiProperty({ example: WeaponTypeEnum.SWORD, enum: WeaponTypeEnum })
  weaponType: WeaponTypeEnum;
}

export class CreateMyCharacterDTO {
  @ApiProperty({ example: 1 })
  characterId: number;
}

export class CreateUserCharacterDTO
  extends CreateMyCharacterDTO
  implements CreateUserCharacterType
{
  @ApiProperty({ example: 1 })
  userId: number;
}

export class UpdateUserCharacterDTO implements UpdateUserCharacterType {
  @ApiProperty({
    example: MAX_CHARACTER_CONSTANTS,
    maximum: MAX_CHARACTER_CONSTANTS,
  })
  constants: number;
  @ApiProperty({ example: 180 })
  critValue: number;
  @ApiProperty({ example: MAX_CHARACTER_LEVEL, maximum: MAX_CHARACTER_LEVEL })
  level: number;
}
