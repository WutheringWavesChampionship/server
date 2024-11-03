import { HASH_ROUNDS } from '@constants/hash';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserType } from '@shared/interface';
import { compareSync, hash } from 'bcryptjs';
import { AdminEntity, ImageEntity, UserEntity } from 'modules/database';
import { RegistrationDTO } from 'swagger';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
  ) {}

  async telegramAuth({ id, ...props }: AuthTgProps) {
    const existed = await this.userRepository.findOneBy({
      telegram_id: id,
    });
    if (existed) {
      return this.generateToken(existed);
    } else {
      Logger.log(`New user ${props.username}`, 'auth');
      const entity = this.userRepository.create({
        username: props.first_name || props.username,
      });
      const user = await this.userRepository.save(entity);

      return this.generateToken(user);
    }
  }

  verifyUser(token: string) {
    return this.jwtService.verify<JwtPayloadType>(token);
  }

  async generateToken({ id, username: name }: JwtPayloadType) {
    const payload: JwtPayloadType = { id, username: name };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async deleteUser(id: number) {
    await this.userRepository.delete({ id });
  }

  async findById(id: number): Promise<Omit<UserEntity, 'password'> | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      delete user.password;
    }
    return user;
  }

  async registration({ username, password, photo_url }: RegistrationDTO) {
    const hashPassword = await hash(password, HASH_ROUNDS);
    const newUser = this.userRepository.create({
      username,
      password: hashPassword,
      auth_date: new Date(),
    });
    if (photo_url) {
      const newImage = this.imageRepository.create({ url: photo_url });
      const imageId = (await this.imageRepository.save(newImage)).id;
      newUser.imageId = imageId;
    }
    const user = await this.userRepository.save(newUser);
    return this.generateToken(user);
  }

  async login({ password, username }: LoginUserType) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user || !user.password) {
      throw new NotFoundException();
    }
    const comparePassword = compareSync(password, user.password);
    if (!comparePassword) {
      throw new NotFoundException();
    } else {
      user.auth_date = new Date();
      this.userRepository.save(user);
      return this.generateToken(user);
    }
  }

  async findAdmin(id: number) {
    return this.adminRepository.exists({ where: { userId: id } });
  }
}

type JwtPayloadType = { id: number; username: string };

type AuthTgProps = {
  id: string;
  first_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: string;
  hash: string;
};
