import { ApiProperty } from '@nestjs/swagger';
import {
  MAX_WEAPON_CONSTANTS,
  MAX_WEAPON_LEVEL,
  RarityEnum,
  StatTypeEnum,
  WeaponTypeEnum,
} from '@shared/constants';
import {
  CreateUserWeaponType,
  CreateWeaponType,
  UpdateUserWeaponType,
} from '@shared/interface';

export class CreateWeaponDTO implements CreateWeaponType {
  @ApiProperty({ example: 'Variation' })
  name: string;
  @ApiProperty({ example: 340 })
  baseAttack: number;
  @ApiProperty({ example: StatTypeEnum.ATTACK, enum: StatTypeEnum })
  mainStat: StatTypeEnum;
  @ApiProperty({ example: RarityEnum.EPIC, enum: RarityEnum })
  rarity: RarityEnum;
  @ApiProperty({ example: 34.3 })
  statValue: number;
  @ApiProperty({ example: WeaponTypeEnum.RECTIFIER, enum: [WeaponTypeEnum] })
  type: WeaponTypeEnum;
}

export class CreateMyWeaponDTO {
  @ApiProperty({ example: 1 })
  weaponId: number;
}

export class CreateUserWeaponDTO
  extends CreateMyWeaponDTO
  implements CreateUserWeaponType
{
  @ApiProperty({ example: 1 })
  userId: number;
}

export class UpdateUserWeaponDTO implements UpdateUserWeaponType {
  @ApiProperty({
    example: MAX_WEAPON_CONSTANTS,
    maximum: MAX_WEAPON_CONSTANTS,
  })
  constants: number;
  @ApiProperty({ example: MAX_WEAPON_LEVEL, maximum: MAX_WEAPON_LEVEL })
  level: number;
}
