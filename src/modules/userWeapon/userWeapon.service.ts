import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';
import { AuthService } from 'modules/auth';
import { WeaponEntity, UserWeaponEntity } from 'modules/database';
import { CreateUserWeaponDTO, UpdateUserWeaponDTO } from 'swagger';
import { Repository } from 'typeorm';

@Injectable()
export class UserWeaponService {
  constructor(
    private authService: AuthService,
    @InjectRepository(UserWeaponEntity)
    private userWeaponRepository: Repository<UserWeaponEntity>,
    @InjectRepository(WeaponEntity)
    private weaponRepository: Repository<WeaponEntity>,
  ) {}
  async getUserWeapons(id: number, isOnlyExist: boolean = false) {
    const query = this.weaponRepository
      .createQueryBuilder('weapon')
      .leftJoinAndMapOne(
        'weapon.userWeapon',
        UserWeaponEntity,
        'userWeapon',
        'userWeapon.weaponId = weapon.id AND userWeapon.userId = :userId',
        { userId: id },
      )
      .orderBy('CASE WHEN userWeapon.id IS NOT NULL THEN 0 ELSE 1 END', 'ASC')
      .addOrderBy('userWeapon.level', 'DESC')
      .addOrderBy('weapon.type', 'ASC')
      .addOrderBy(`weapon.rarity`, 'ASC')
      .addOrderBy('userWeapon.constants', 'ASC')
      .addOrderBy('weapon.id', 'ASC');
    if (isOnlyExist) {
      query.where('userWeapon.id IS NOT NULL');
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
