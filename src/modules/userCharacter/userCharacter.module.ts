import { Module } from '@nestjs/common';
import { UserCharacterService } from './userCharacter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCharacterEntity } from 'modules/database';
import { AuthModule } from 'modules/auth';
import { UserCharacterController } from './userCharacter.controller';

@Module({
  controllers: [UserCharacterController],
  providers: [UserCharacterService],
  imports: [AuthModule, TypeOrmModule.forFeature([UserCharacterEntity])],
  exports: [UserCharacterService],
})
export class UserCharacterModule {}
