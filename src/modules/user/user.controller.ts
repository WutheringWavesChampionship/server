import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { API_ROUTES, API_ROUTES_ENUM } from '@shared/constants/api';

import { AuthGuard } from '@guards/index';
import { UserEntity } from 'modules/database';

@ApiTags('User')
@ApiBearerAuth()
@Controller()
export class UserController {
  constructor(private service: UserService) {}

  @ApiOperation({
    summary: 'Get me',
    description: 'get authorized user data',
  })
  @ApiResponse({ status: 200 })
  @Get(API_ROUTES[API_ROUTES_ENUM.ME])
  @UseGuards(AuthGuard)
  create(@Req() { user }: { user: UserEntity }) {
    return user;
  }
}
