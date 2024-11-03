import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './database';
import { ImageModule } from './image/image.module';
import { AuthModule } from './auth';
import { UserModule } from './user/user.module';
import { CharacterModule } from './characters/character.module';
import { UserCharacterModule } from './userCharacter/userCharacter.module';
import { UserWeaponModule } from './userWeapon/userWeapon.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    typeOrmConfig(),
    ImageModule,
    AuthModule,
    UserModule,
    CharacterModule,
    UserCharacterModule,
    UserWeaponModule,
  ],
})
export class AppModule {}
