import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';
import { AuthService } from 'modules/auth';
import { UserWeaponEntity } from 'modules/database';
import { CreateUserWeaponDTO, UpdateUserWeaponDTO } from 'swagger';
import { Repository } from 'typeorm';

@Injectable()
export class UserWeaponService {
  constructor(
    private authService: AuthService,
    @InjectRepository(UserWeaponEntity)
    private userWeaponRepository: Repository<UserWeaponEntity>,
  ) {}
  async getUserWeapons(id: number) {
    const data = await this.userWeaponRepository
      .createQueryBuilder('userWeapon')
      .leftJoinAndSelect('userWeapon.weapon', 'weapon')
      .where('userWeapon.userId = :userId', { userId: id })
      .getMany();
    return data.map((el) => {
      const weapon = { ...el.weapon };
      weapon.image = el.weapon.imageId
        ? API_ROUTES[API_ROUTES_ENUM.IMAGE_CURRENT].replace(
            ':id',
            String(el.weapon.imageId),
          )
        : undefined;
      return { ...el, weapon };
    });
  }

  async updateUserWeapon({
    id,
    constants,
    level,
    userId,
  }: UpdateUserWeaponDTO & { id: number; userId: number }) {
    const entity = await this.userWeaponRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException();
    }
    const isAdmin = await this.authService.isAdmin(userId);
    if (!isAdmin && entity.userId !== userId) {
      throw new ForbiddenException();
    }
    entity.constants = constants;
    entity.level = level;
    return this.userWeaponRepository.save(entity);
  }

  async createUserWeapon({ userId, weaponId }: CreateUserWeaponDTO) {
    const existed = await this.userWeaponRepository.findOneBy({
      userId,
      weaponId,
    });
    if (existed) {
      return existed;
    }
    const entity = this.userWeaponRepository.create({ userId, weaponId });
    return this.userWeaponRepository.save(entity);
  }

  async getUserWeapon(id: number) {
    return this.userWeaponRepository.findOneBy({ id });
  }
}
