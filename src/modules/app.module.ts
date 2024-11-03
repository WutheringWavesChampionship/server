import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './database';
import { ImageModule } from './image/image.module';
import { AuthModule } from './auth';
import { UserModule } from './user/user.module';

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
  ],
})
export class AppModule {}
