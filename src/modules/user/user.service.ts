import { HASH_ROUNDS } from '@constants/hash';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';
import { CreateUserType } from '@shared/interface';
import { hash } from 'bcryptjs';
import { UserEntity } from 'modules/database';
import { ImageService } from 'modules/image/image.service';
import { Repository } from 'typeorm';

const BASE_IMAGE_PATH = 'wuwa/users/';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private imageService: ImageService,
  ) {}

  async getUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      delete user.password;
      return {
        ...user,
        image: user.imageId
          ? API_ROUTES[API_ROUTES_ENUM.IMAGE_CURRENT].replace(
              ':id',
              String(user.imageId),
            )
          : undefined,
      };
    } else {
      throw new NotFoundException();
    }
  }

  async updateUser({
    id,
    username,
    password,
    telegram_id,
  }: CreateUserType & { id: number }) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }
    if (password && password !== '') {
      const hashPassword = await hash(password, HASH_ROUNDS);
      user.password = hashPassword;
    }
    user.username = username;
    user.telegram_id = telegram_id;
    try {
      this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(error.getResponse(), error.getStatus());
    }
  }

  async updateUserImage({ data, id }: UploadImageProps) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }
    const basePath = `${BASE_IMAGE_PATH}${id}`;
    if (user.imageId) {
      const image = await this.imageService.updateImage({
        data,
        id: user.imageId,
        basePath,
      });
      user.imageId = image.id;
    } else {
      const image = await this.imageService.createImage({ basePath, data });
      user.imageId = image.id;
    }
    const result = await this.userRepository.save(user);
    return {
      ...result,
      image: result.imageId
        ? API_ROUTES[API_ROUTES_ENUM.IMAGE_CURRENT].replace(
            ':id',
            String(result.imageId),
          )
        : undefined,
    };
  }
}

interface UploadImageProps {
  id: number;
  data: string | Buffer;
}
