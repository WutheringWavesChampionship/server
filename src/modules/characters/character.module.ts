import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterEntity } from 'modules/database';
import { ImageModule } from 'modules/image/image.module';
import { AuthModule } from 'modules/auth';

@Module({
  controllers: [CharacterController],
  providers: [CharacterService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([CharacterEntity]),
    ImageModule,
  ],
  exports: [CharacterService],
})
export class CharacterModule {}
