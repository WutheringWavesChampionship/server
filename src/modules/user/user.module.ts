import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'modules/database';
import { ImageModule } from 'modules/image/image.module';
import { AuthModule } from 'modules/auth';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity]), ImageModule],
  exports: [UserService],
})
export class UserModule {}
