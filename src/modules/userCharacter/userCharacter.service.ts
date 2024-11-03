import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';
import { AuthService } from 'modules/auth';
import { CharacterEntity, UserCharacterEntity } from 'modules/database';
import { CreateUserCharacterDTO, UpdateUserCharacterDTO } from 'swagger';
import { Repository } from 'typeorm';

@Injectable()
export class UserCharacterService {
  constructor(
    private authService: AuthService,
    @InjectRepository(UserCharacterEntity)
    private userCharacterRepository: Repository<UserCharacterEntity>,
    @InjectRepository(CharacterEntity)
    private characterRepository: Repository<CharacterEntity>,
  ) {}
  async getUserCharacters(id: number, isOnlyExist: boolean = false) {
    const query = this.characterRepository
      .createQueryBuilder('character')
      .leftJoinAndMapOne(
        'character.userCharacter',
        UserCharacterEntity,
        'userCharacter',
        'userCharacter.characterId = character.id AND userCharacter.userId = :userId',
        { userId: id },
      )
      .orderBy(
        'CASE WHEN userCharacter.id IS NOT NULL THEN 0 ELSE 1 END',
        'ASC',
      )
      .addOrderBy('userCharacter.level', 'DESC')
      .addOrderBy('character.element', 'ASC')
      .addOrderBy(`weapon.rarity`, 'DESC')
      .addOrderBy('userCharacter.constants', 'ASC')
      .addOrderBy('character.id', 'ASC');
    if (isOnlyExist) {
      query.where('userCharacter.id IS NOT NULL');
    }
    const result = await query.getMany();
    return result.map((el) => ({
      ...el,
      image: el.imageId
        ? API_ROUTES[API_ROUTES_ENUM.IMAGE_CURRENT].replace(
            ':id',
            String(el.imageId),
          )
        : null,
    }));
  }

  async updateUserCharacter({
    id,
    constants,
    critValue,
    level,
    userId,
  }: UpdateUserCharacterDTO & { id: number; userId: number }) {
    const entity = await this.userCharacterRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException();
    }
    const isAdmin = await this.authService.isAdmin(userId);
    if (!isAdmin && entity.userId !== userId) {
      throw new ForbiddenException();
    }
    entity.constants = constants;
    entity.critValue = critValue;
    entity.level = level;
    return this.userCharacterRepository.save(entity);
  }

  async createUserCharacter({ userId, characterId }: CreateUserCharacterDTO) {
    const existed = await this.userCharacterRepository.findOneBy({
      userId,
      characterId,
    });
    if (existed) {
      return existed;
    }
    const entity = this.userCharacterRepository.create({ userId, characterId });
    return this.userCharacterRepository.save(entity);
  }

  async getUserCharacter(id: number) {
    return this.userCharacterRepository.findOneBy({ id });
  }
}
