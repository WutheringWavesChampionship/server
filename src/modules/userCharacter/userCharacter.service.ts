import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';
import { AuthService } from 'modules/auth';
import { UserCharacterEntity } from 'modules/database';
import { CreateUserCharacterDTO, UpdateUserCharacterDTO } from 'swagger';
import { Repository } from 'typeorm';

@Injectable()
export class UserCharacterService {
  constructor(
    private authService: AuthService,
    @InjectRepository(UserCharacterEntity)
    private userCharacterRepository: Repository<UserCharacterEntity>,
  ) {}
  async getUserCharacters(id: number) {
    const data = await this.userCharacterRepository
      .createQueryBuilder('userCharacter')
      .leftJoinAndSelect('userCharacter.character', 'character')
      .where('userCharacter.userId = :userId', { userId: id })
      .getMany();
    return data.map((el) => {
      const character = { ...el.character };
      character.image = el.character.imageId
        ? API_ROUTES[API_ROUTES_ENUM.IMAGE_CURRENT].replace(
            ':id',
            String(el.character.imageId),
          )
        : undefined;
      return { ...el, character };
    });
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

  async deleteUserCharacter(id: number, userId: number) {
    const entity = await this.userCharacterRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException();
    }
    const isAdmin = await this.authService.isAdmin(userId);
    if (!isAdmin && entity.userId !== userId) {
      throw new ForbiddenException();
    }
    return this.userCharacterRepository.delete({ id });
  }
}
