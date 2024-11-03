import { Module } from '@nestjs/common';
import { WeaponService } from './weapon.service';
import { WeaponController } from './weapon.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeaponEntity } from 'modules/database';
import { ImageModule } from 'modules/image/image.module';
import { AuthModule } from 'modules/auth';

@Module({
  controllers: [WeaponController],
  providers: [WeaponService],
  imports: [AuthModule, TypeOrmModule.forFeature([WeaponEntity]), ImageModule],
  exports: [WeaponService],
})
export class WeaponModule {}
