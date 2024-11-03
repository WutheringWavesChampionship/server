import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { ImageEntity } from 'modules/database';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  exports: [ImageService],
})
export class ImageModule {}
