import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';

import { CharacterEntity } from 'modules/database';
import { ImageService } from 'modules/image/image.service';
import { CreateCharacterDTO } from 'swagger';
import { Repository } from 'typeorm';

const BASE_IMAGE_PATH = 'wuwa/characters/';

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(CharacterEntity)
    private characterRepository: Repository<CharacterEntity>,
    private imageService: ImageService,
  ) {}

  async getCharacter(id: number) {
    const entity = await this.characterRepository.findOneBy({ id });
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

  async getAllCharacters() {
    return this.characterRepository
      .find({
        order: { element: 'ASC', id: 'ASC' },
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

  async updateCharacter({
    id,
    element,
    name,
    rarity,
    weaponType,
  }: CreateCharacterDTO & { id: number }) {
    const entity = await this.characterRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException();
    }
    entity.element = element;
    entity.name = name;
    entity.rarity = rarity;
    entity.weaponType = weaponType;
    return this.characterRepository.save(entity);
  }

  async updateCharacterImage({ data, id }: UploadImageProps) {
    const entity = await this.characterRepository.findOneBy({ id });
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
    await this.characterRepository.save(entity);
  }

  async deleteCharacter(id: number) {
    return await this.characterRepository.delete({ id });
  }
}

interface UploadImageProps {
  id: number;
  data: string | Buffer;
}
