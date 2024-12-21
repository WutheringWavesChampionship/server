import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';

import { WeaponEntity } from 'modules/database';
import { ImageService } from 'modules/image/image.service';
import { CreateWeaponDTO } from 'swagger';
import { Repository } from 'typeorm';

const BASE_IMAGE_PATH = 'wuwa/characters/';

@Injectable()
export class WeaponService {
  constructor(
    @InjectRepository(WeaponEntity)
    private weaponRepository: Repository<WeaponEntity>,
    private imageService: ImageService,
  ) {}

  createWeapon(data: CreateWeaponDTO) {
    const entity = this.weaponRepository.create(data);
    return this.weaponRepository.save(entity);
  }

  async getWeapon(id: number) {
    const entity = await this.weaponRepository.findOneBy({ id });
    if (entity) {
      if (entity.imageId) {
        entity.image = API_ROUTES[API_ROUTES_ENUM.IMAGE_CURRENT].replace(
          ':id',
          String(entity.imageId),
        );
      }
      return entity;
    } else {
      throw new NotFoundException();
    }
  }

  getAllWeapons() {
    return this.weaponRepository
      .find({
        order: { type: 'ASC', id: 'ASC' },
      })
      .then((data) =>
        data.map((val) => ({
          ...val,
          image: val.imageId
            ? API_ROUTES[API_ROUTES_ENUM.IMAGE_CURRENT].replace(
                ':id',
                String(val.imageId),
              )
            : null,
        })),
      );
  }

  async updateWeapon({
    id,
    baseAttack,
    name,
    rarity,
    mainStat,
    statValue,
    type,
  }: CreateWeaponDTO & { id: number }) {
    const entity = await this.weaponRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException();
    }
    entity.name = name;
    entity.rarity = rarity;
    entity.baseAttack = baseAttack;
    entity.mainStat = mainStat;
    entity.statValue = statValue;
    entity.type = type;
    return this.weaponRepository.save(entity);
  }

  async updateWeaponImage({ data, id }: UploadImageProps) {
    const entity = await this.weaponRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException();
    }
    const basePath = `${BASE_IMAGE_PATH}${id}`;
    if (entity.imageId) {
      const image = await this.imageService.updateImage({
        data,
        id: entity.imageId,
        basePath,
      });
      entity.imageId = image.id;
    } else {
      const image = await this.imageService.createImage({ basePath, data });
      entity.imageId = image.id;
    }
    await this.weaponRepository.save(entity);
  }

  async deleteWeapon(id: number) {
    return await this.weaponRepository.delete({ id });
  }
}

interface UploadImageProps {
  id: number;
  data: string | Buffer;
}
