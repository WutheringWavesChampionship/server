import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { CharacterEntity } from './character.entity';
import { UpdateUserCharacterType } from '@shared/interface';
import { CustomEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  MAX_CHARACTER_CONSTANTS,
  MAX_CHARACTER_LEVEL,
} from '@shared/constants';

@Entity('user_characters')
export class UserCharacterEntity
  extends CustomEntity
  implements UpdateUserCharacterType
{
  @ManyToOne(() => UserEntity, (entity) => entity.id)
  @JoinColumn({
    name: 'userId',
  })
  user!: UserEntity;
  @ApiProperty({ example: 1 })
  @Column()
  userId!: number;

  @ManyToOne(() => CharacterEntity, (entity) => entity.id)
  @JoinColumn({
    name: 'characterId',
  })
  character!: CharacterEntity;
  @ApiProperty({ example: 1 })
  @Column()
  characterId!: number;

  @Column({ default: 0, type: 'smallint' })
  @ApiProperty({
    example: MAX_CHARACTER_CONSTANTS,
    maximum: MAX_CHARACTER_CONSTANTS,
    minimum: 0,
  })
  constants!: number;

  @ApiProperty({
    example: MAX_CHARACTER_LEVEL,
    maximum: MAX_CHARACTER_LEVEL,
    minimum: 1,
  })
  @Column({ default: 1, type: 'smallint' })
  level!: number;

  @ApiProperty({ example: 220 })
  @Column({ nullable: true, type: 'smallint' })
  critValue?: number;
}
