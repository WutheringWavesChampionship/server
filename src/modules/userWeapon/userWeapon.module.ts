import { Module } from '@nestjs/common';
import { UserWeaponService } from './userWeapon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWeaponEntity } from 'modules/database';
import { AuthModule } from 'modules/auth';
import { UserWeaponController } from './userWeapon.controller';

@Module({
  controllers: [UserWeaponController],
  providers: [UserWeaponService],
  imports: [AuthModule, TypeOrmModule.forFeature([UserWeaponEntity])],
  exports: [UserWeaponService],
})
export class UserWeaponModule {}
