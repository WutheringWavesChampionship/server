import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadImageProps } from '@shared/interface';
import { Response } from 'express';
import { storage } from 'firebase-admin';
import { ImageEntity } from 'modules/database';
import { Repository } from 'typeorm';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
  ) {}

  async uploadImage({ basePath, data }: UploadImageProps) {
    const bucket = storage().bucket();
    const filePath = `${basePath}/${Date.now()}`;
    const file = bucket.file(filePath);
    await file.save(data, { private: false }).catch((err) => {
      Logger.error(err.message, 'Image');
    });
    return filePath;
  }

  async createImage({ basePath, data, userId }: CreatingImageProps) {
    const filePath = await this.uploadImage({ basePath, data });
    const entity = this.imageRepository.create({
      filePath,
    });
    Logger.log(`user id: ${userId} upload new image id: ${entity.id}`, 'Image');
    return this.imageRepository.save(entity);
  }

  async updateImage({ data, id, userId, basePath }: UpdateImageProps) {
    const image = await this.imageRepository.findOneBy({ id });
    if (!image) {
      throw new NotFoundException({ image: id });
    }
    if (!image.filePath) {
      await this.uploadImage({ basePath, data });
      Logger.log(`user id: ${userId} update image id: ${id}`, 'Image');
    } else {
      const bucket = storage().bucket();
      const file = bucket.file(image.filePath);
      await file.save(data, { private: false }).catch((err) => {
        Logger.error(err.message, 'Image');
      });
      Logger.log(`user id: ${userId} update image id: ${id}`, 'Image');
    }
    return image;
  }

  async deleteImage(id: number) {
    const image = await this.imageRepository.findOneBy({ id });
    if (!image) {
      throw new NotFoundException({ image: id });
    }
    const bucket = storage().bucket();
    try {
      await Promise.all([
        image.filePath && bucket.file(image.filePath).delete(),
        this.imageRepository.delete({ id }),
        Logger.log(`image id: id delete successful`, 'Image'),
      ]);
    } catch (error) {
      Logger.error(`Deleting image id: ${id}`, 'Image');
      throw new InternalServerErrorException({ image: id, error });
    }
  }

  async getImage({ id, res }: GetImage) {
    const image = await this.imageRepository.findOneBy({ id });
    if (!image || !image.filePath) {
      throw new NotFoundException({ image: id });
    }
    const bucket = storage().bucket();
    const file = bucket.file(image.filePath);
    const readStream = file.createReadStream();

    const data: Uint8Array[] = [];
    readStream.on('data', (chunk) => {
      data.push(chunk);
    });

    readStream.on('end', () => {
      const buffer = Buffer.concat(data);
      res.send(buffer);
    });

    readStream.on('error', (error) => {
      throw new NotFoundException({ image: id, error });
    });
  }
}

interface CreatingImageProps extends UploadImageProps {
  userId?: number;
}

interface UpdateImageProps extends UploadImageProps {
  id: number;
  userId?: number;
}

interface GetImage {
  id: number;
  res: Response;
}
